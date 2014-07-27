/*
_marklogic/services/model/mlModel.js
 */

define(['_marklogic/module'], function (module) {

  module.factory('mlModel', [

    '$injector', 'mlHttp', 'mlSchema',
    function (
      $injector, mlHttp, mlSchema
    ) {
      var MlModel = function (spec) {
        this.$ml = {};
        this.assignInstance(spec || {});
      };

      MlModel.prototype.assignInstance = function (obj) {
        _.merge(this, { instance: obj });
        this.setValidity();
      };

      MlModel.prototype.validateObject = function (obj) {
        return mlSchema.validate(obj, this.factory.$ml.spec.schema.id);
      };

      MlModel.prototype.setValidity = function () {
        this.$ml.validation = this.validateObject(this.instance);
        this.$ml.invalid = !(
            this.$ml.valid = this.$ml.validation.errors.length === 0
        );
      };

      var modelSvc = {};

      modelSvc.extend = function (spec) {

        var ModelFactory = function (instanceSpec) {
          MlModel.call(this, instanceSpec);
        };
        ModelFactory.prototype = Object.create(MlModel.prototype);

        // overrides (e.g. a different assignInstance function so that
        // session drops the password after it is posted succeessfully)
        _.merge(ModelFactory.prototype, spec.proto || {});
        // instances can find their factory (and it's "goodies")
        ModelFactory.prototype.factory = ModelFactory;
        // the goodies -- this $ml is on the factory instead of
        // prototype so it doesn't
        // clash with instance $ml
        //
        mlSchema.addSchema(spec.schema);
        ModelFactory.$ml = {
          spec: spec
        };

        var childSvc = {};
        childSvc.Factory = ModelFactory;
        childSvc.create = function (spec) {
          return new ModelFactory(spec);
        };
        spec.resource = spec.resource || {};
        spec.resource = mlHttp.defineResource(childSvc, spec);

        return childSvc;
      };

      return modelSvc;
    }
  ]);
});
