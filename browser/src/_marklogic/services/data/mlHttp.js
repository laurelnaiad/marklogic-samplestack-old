/*
_marklogic/services/mlHttpAdapter.js
 */
define(['_marklogic/module'], function (module) {

  // based on restangular
  var MlHttpProvider = function (RestangularProvider) {
    var rp = RestangularProvider;

    angular.extend(this, rp);
    this.setBaseUrl('/v1');

    // we hope not to need any provider-time configuration
    // restangular doesn't seem to have anythying tha absolutely
    // must be done at provider time.
    // this is good b/c consistent with angular 2.0 direction
    this.$get = ['Restangular', 'mlSchema', 'mlWaiter',
      function (Restangular, mlSchema, mlWaiter) {
        return new MlHttp(Restangular, mlSchema, mlWaiter);
      }
    ];
  };

  var MlHttp = function (Restangular, mlSchema, mlWaiter) {
    var r = Restangular;

    angular.extend(this, r);

    this.setResponseExtractor(function (response) {
      response._instance = angular.copy(response);
      return response;
    });
    // by setting this to an array, we prepare ourselves to be able
    // to choose on a model by model basis whether it is parentless
    // (i.e. lives in an embedded resource endpoint)
      /// parentless is our default since we prefer patch to using
      /// embedded resource endpoints
    this.configuration.parentless = [];

    var resourceReturned = function (resourcePromise, obj) {
      var waiterWaiter = mlWaiter.waitOn(obj);
      resourcePromise.then(
        function (data) {
          obj.assignInstance(data._instance);
          waiterWaiter.resolve();
        },
        function (reason) {
          angular.noop(reason);
          waiterWaiter.reject(reason);
        }
      );
      return obj;
    };
    var serviceMethods = {
      getOne: function (resobj) {
        var args = Array.prototype.slice.call(arguments, 1);
        var resourcePromise =
            resobj.one.apply(resobj, args).get();
        var obj = this.create();
        return resourceReturned(resourcePromise, obj);
      },

      post: function (resobj) {
        var args = Array.prototype.slice.call(arguments, 1);
        var obj = args[0];
        args[0] = obj.instance;
        var resourcePromise = resobj.post.apply(resobj, args);
        return resourceReturned(resourcePromise, obj);
      }
    };

    this.defineResource = function (service, spec) {
      // service, Factory, spec) {
      spec.resource.resourceId = spec.schema.id;

      // default resource name is the traling text after jsonref hash
      spec.resource.resourceName = spec.resource.resourceName ||
          spec.resource.resourceId.substring(
            spec.resource.resourceId.lastIndexOf('#') + 1
          );

      if (!spec.resource.embedded) {
        this.configuration.parentless.push(spec.resource.resourceName);
      }

      spec.resource._resObj = Restangular.service(spec.resource.resourceName);

      _.forEach(serviceMethods, function (method, name) {
        service[name] = method.bind(
          service, spec.resource._resObj
        );
      });

    };
  };


  module.provider('mlHttp', [
    'RestangularProvider',
    MlHttpProvider
  ]);

});
