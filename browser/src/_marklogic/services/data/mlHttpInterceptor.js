define(['_marklogic/module'], function (module) {

  module.factory('mlHttpInterceptor', [
    // we inject injector in order to avoid circular dependency on $http
    '$injector', '$q', 'mlUtil', 'appSettings',
    function ($injector, $q, mlUtil, appSettings) {

      var $http;
      var outstanding;

      var csrfMethods = {
        'POST': true,
        'PUT': true,
        'PATCH': true,
        'DELETE': true
      };

      // replace the name of an endpoint
      var replaceEndpoint = function (spec) {
        var findExpr;
        var newNameExpr;
        if (spec.withParameters) {
          findExpr = new RegExp('(.*/v1/)(' + spec.findName + ')(/.+)');

          if (spec.newName) {
            newNameExpr = '$1' + spec.newName;
            if (!spec.dropParameters) {
              newNameExpr += '$3';
            }
          }
        }
        else {
          findExpr = new RegExp('(.*/v1/)(' + spec.findName + ')$');
          if (spec.newName) {
            newNameExpr = '$1' + spec.newName;
          }
        }
        var ep = spec.config.url;
        if (ep.match(findExpr) &&
            spec.findMethods.indexOf(spec.config.method) !== -1 &&
            (typeof spec.extraConditions === 'undefined' ||
                spec.extraConditions
            )
        ) {
          if (spec.newName) {
            spec.config.url = ep.replace(findExpr, newNameExpr);
          }
          if (spec.newMethod) {
            spec.config.method = spec.newMethod;
          }
        }
      };


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
          var requestConfig = {
            method: 'GET',
            url: '/v1/session',
            doNotOverride: true
          };
          var deferred = $q.defer();
          $http(requestConfig).then(
            function (response) {
              // if the server doesn't give us a CSRF token, we should
              // we complain? TODO
              var token = response.headers('X-CSRF-TOKEN');
              if (token){
                $http.defaults.headers.common['X-CSRF-TOKEN'] = token;
              }
              else {
                $http.defaults.headers.common['X-CSRF-TOKEN'] = 'dummy';
              }
              deferred.resolve(token);
            },
            function (reason) {
              deferred.reject(new Error('unable to get CSRF token', reason));
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
      //

      return {

        request: function (config) {

          // ensure we have $http
          $http = $http || $injector.get('$http');

          if (config.doNotOverride) {
            delete config.doNotOverride;
            return config;
          }
          else {
            // POST /v1/session -> /v1/login
            replaceEndpoint({
              config: config,
              findMethods: ['POST'],
              findName: 'session',
              newName: 'login'
            });

            // GET/OPTIONS /v1/session/* -> /v1/contributors/*
            replaceEndpoint({
              config: config,
              findMethods: ['GET', 'OPTIONS'],
              findName: 'session',
              withParameters: true,
              newName: 'contributors',
              extraConditions: !config.doNotOverride // see CSRF handling
            });

            // DELETE /v1/session/* -> GET -> /v1/logout
            replaceEndpoint({
              config: config,
              findMethods: ['DELETE'],
              findName: 'session',
              withParameters: true,
              newName: 'logout',
              newMethod: 'GET',
              dropParameters: true
            });

            // login requires form-encoding
            if (config.url.match(/\/v1\/login/) && config.method === 'POST') {
              config.headers['Content-Type'] =
                  'application/x-www-form-urlencoded';
              config.data =
                  'username=' + encodeURI(config.data.username) + '&' +
                  'password=' + encodeURI(config.data.password);
            }

            if (appSettings.disableCsrf) {
              return config;
            }
            else {
              if (mustGetCsrf(config)) {
                return setCsrfThenResolveConfig(config);
              }
              else {
                return config;
              }

            }
          }
        }
      };

    }
  ]);

  module.config([
    '$httpProvider',
    function ($httpProvider) {
      $httpProvider.interceptors.push('mlHttpInterceptor');
    }
  ]);

});
