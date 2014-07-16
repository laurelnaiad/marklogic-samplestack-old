/*
_marklogic/services/mlHttpAdapter.js
 */
define(['_marklogic/module'], function (module) {

  var bodyBearingMethods = {
    'POST': true,
    'PUT': true,
    'PATCH': true,
  };

  var csrfMethods = {
    'POST': true,
    'PUT': true,
    'PATCH': true,
    'DELETE': true
  };




  /**
   * @ngdoc service
   * @name mlHttpInterceptor
   * @requires $injector
   * @requires $q
   * @requires mlUtil
   *
   * @description Ensurse X-CSRF-TOKEN header is retreived before first
   * method requiring CSRF is run.
   * (via GET to /v1/session).
   *
   * Sets the header to be included in those methods for the lifetime of the
   * app.
   */
  module.factory('mlHttpInterceptor', [
    // we inject injector in order to avoid circular dependency on $http
    '$injector', '$q', 'mlUtil',
    function ($injector, $q, mlUtil) {

      var $http;
      var outstanding;

      // whether or not we need to get csrf before doing what the app
      // actually wants
      var mustGetCsrf = function (config) {

        return csrfMethods[config.method]
            && !$http.defaults.headers.common['X-CSRF-TOKEN'];
      };

      // return a promise to have set the csrf header default. To do this,
      // round-trip with the server on get /v1/session
      var setCsrf = function () {
        if (outstanding) {
          return outstanding;
        }
        else {
          var deferred = $q.defer();
          $http.get('/v1/session').then(
            function (response) {
              var token = response.headers('X-CSRF-TOKEN');
              $http.defaults.headers.common['X-CSRF-TOKEN'] = token;
              deferred.resolve(token);
            },
            function (reason) {
              deferred.reject(
                new Error('unable to get CSRF token: ', JSON.stringify(reason))
              );
            }
          );

          outstanding = deferred.promise;
          return outstanding;
        }
      };

      var setCsrfThenResolveConfig = function (config) {
        var deferred = $q.defer();

        setCsrf().then(
          function (token) {
            config.headers['X-CSRF-TOKEN'] = token;
            deferred.resolve(config);
          },
          deferred.reject
        );

        return deferred.promise;
      };

      // the interceptor service
      return {

        request: function (config) {
          // ensure we have $http
          $http = $http || $injector.get('$http');

          if (config.url === '/v1/login' && config.method === 'POST') {
            config.headers['Content-Type'] =
                'application/x-www-form-urlencoded';
            config.data =
                'username=' + encodeURI(config.data.username) + '&' +
                'password=' + encodeURI(config.data.password);
          }

          if (mustGetCsrf(config)) {
            return setCsrfThenResolveConfig(config);
          }
          else {
            return config;
          }
        }
      };

    }
  ]);
  // add patch support and register the interceptor
  module.config([
    '$httpProvider', '$provide',
    function ($httpProvider, $provide) {
      $provide.decorator('$http', [
        '$delegate',
        function ($delegate) {
          $delegate.patch = function (url, data, config) {
            return $delegate(angular.extend(config || {}, {
              method: 'PATCH',
              url: url,
              data: data
            }));
          };
          return $delegate;
        }
      ]);
      $httpProvider.defaults.headers.patch = {
        'Content-Type': 'application/json;charset=utf-8'
      };
      $httpProvider.interceptors.push('mlHttpInterceptor');
    }
  ]);

  /**
   * @ngdoc service
   * @name mlHttpAdapter
   * @requires $q
   * @requires $http
   * @requires mlUtil
   * @requires mlWaiter
   *
   * @description Enables RESTful operations on MlModel elements where the
   * those elements are configured to support specific operations on specific
   * endpoints.
   */
  module.factory('mlHttpAdapter', [
    '$q', '$http', 'mlUtil', 'mlWaiter',
    function (
      $q, $http, mlUtil, mlWaiter
    ) {

      var MlHttpAdapterError = function (err) {
        this.name = 'MlHttpAdapterError';
        angular.extend(this, err);
      };
      MlHttpAdapterError.prototype = new Error();
      MlHttpAdapterError.prototype.constructor = MlHttpAdapterError;

      var svc = {};

      /**
       * Peform an http operation. If the method normally has a body,
       * then either the data parameter is the body if it is present,
       * otherwise the modelInstance value is the body.
       *
       * Uses the model instance's operations definitions to determine
       * whether the operation is supported and its expected return type,
       * which should also be a model type.
       *
       * Mutates the modelInstance if the return type is not different.
       * @param  {string} operation e.g. 'GET', 'PATCH'
       * @param  {MlModel} modelInstance an instance of a model. Pass a
       * default insantance for 'GET'.
       * @param  {[Object]} data If present, the data to send.
       * @return {MlModel} The returned data from the server, as the mutated
       * instance or a new instance, depending on the model's operation
       * definition..
       */
      var operation = function (operation, modelInstance, data) {
        var modelOp = modelInstance.operations &&
            modelInstance.operations[operation];
        if (modelOp) {

          // the return instance is what we'll give to the waiter to set up
          // It is the instance that the app will receive, and the waiter
          // will manage the properties associated with this operation on that
          // instance, including the promise that tha pplication will be able
          // to track to know when the operation is complete (or failed).
          var returnInstance;
          if (modelOp.expects && !(modelInstance instanceof modelOp.expects)) {
            // this model instances expects the operation to return a
            // *different type of object, so wer don't reuse the instance.
            //
            // We have no data for this new object yet, so it's an empty
            // instance of the type expected.
            //
            // TODO: consider some overrides for model elements that need more
            // control.
            returnInstance = new modelOp.expects();
          }
          else {
            // the type should remain the same, so we assuming its the same
            // instance, amd everybody can keep "using" the instance, though
            // it will be mutated as we proceed.
            returnInstance = modelInstance;
          }
          // the promise the waiter will hang on until we are done
          var waiterDeferred = $q.defer();
          // the waiter will wait for our signal (and our data) and deal with
          // the instance when we say so.
          mlWaiter.waitFor(waiterDeferred.promise, returnInstance);

          // the app can wait on this promise if it wants, but we'll force
          // the operation to go through regardless.
          var appDeferred = $q.defer();

          // build url
          var params = [];
          angular.forEach(modelOp.params, function (val, key) {
            var param = encodeURI(key) + '=';
            if (typeof val === 'string') {
              param += encodeURI(modelInstance.value[val]);
            }
            else {
              param = encodeURI(val(modelInstance));
            }
            params.push(param);
          });

          var url = '/v1' + modelOp.endpoint;
          url += params.length ? '?' + params.join('&') : '';

          // for body bearing methods, pass data or the modelInstance.
          var reqConfig = {
            url: url,
            method: operation,
          };

          if (bodyBearingMethods[operation]) {
            if (data) {
              // if data is specified, always use it
              reqConfig.data = data;
            }
            else {
              if (modelOp.dataOut) {
                // prefer a dataOut function if it is available
                reqConfig.data = modelOp.dataOut();
              }
              else {
                // fall back to using the instance value, e.g.
                // for crud
                reqConfig.data = modelInstance.value;
              }
            }
          }

          // send the request
          var request = $http(reqConfig);
          request.then(
            function (response) {
              // success -- tell the waiter, who is reponsible for setting
              // metadata properties and resolving the promise the app
              // is watching
              waiterDeferred.resolve(response.data);
            },
            function (reason) {
              // fail -- send reason to waiter
              waiterDeferred.reject(reason);
            }
          );

          // return the (version of) the instance that is the output.
          // it won't be (re)populatd until the request is resolved
          return returnInstance;
        }
        else {
          // app wanted an operation that isn't supported for this model element
          throw new Error('operation not supported: ' + operation);
        }

      };

      svc.post = function (modelInstance, data) {
        return operation('POST', modelInstance, data);
      };
      svc.get = function (modelInstance, data) {
        return operation('GET', modelInstance, data);
      };

      return svc;

    }
  ]);

});
