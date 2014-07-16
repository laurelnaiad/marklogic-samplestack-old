/*
_marklogic/services/model/mlModel.js
 */

define(['_marklogic/module'], function (module) {

  module.factory('MlModel', [

    'mlSchema', 'mlUtil',
    function (
      mlSchema, mlUtil
    ) {

      var MlModel = function (instanceSpec) {
        mlUtil.extend(this, {
          value: instanceSpec
        });
        this.setValidity();
      };

      MlModel.prototype.operations = {};

      MlModel.prototype.validateObject = function (obj, schema) {
        return mlSchema.validate(obj, schema);
      };

      MlModel.prototype.setValidity = function () {
        this.$mlValidation = this.validateObject(this.value, this.$schema);
        this.$mlInvalid = !(
            this.$mlValid = this.$mlValidation.errors.length === 0
        );
      };

      MlModel.prototype.attachScope = function (scope) {
        this.$scope = scope;
      };

      MlModel.prototype.detachScope = function () {
        var scope = this.$scope;
        this.$scope = null;
      };

      return MlModel;
    }
  ]);
});
/*

will provide a limited set of operations on data, to allow for easy
implementation of IAdapter. E.g.:

* limit()
* skip()
* find(query)
* findById()
* count()
* order()

 Updating properties of Model instances should be managed through mutator
 methods. Views can bind to plain JavaScript objects as well as Model instances
 in Angular 2.

IAdapter Example class FirebaseAdapter implements IAdapter {...}
var fooAdapter = new FirebaseAdapter(‘http://foo’);
var myModel = new Model({adapter: fooAdapter});

Even though we only have one model and one adapter, we'll follow the "pass
the adapter to the model" pattern to guide us in establishing/maintaining a
separation of concerns.

It is ok that some of this is a relatively thin layer over mlHttpAdapter, as
long as it doesn't care about the network or http status codes and other
protocol stuff.  When Angular 2.0 hits, this won't just be pluggable,
but it may not require wholesale refactoring.
 */

        // read the spec and enable the features of the model
        // element that we support.
        //
        // This has a lot to do with what an application needs/wants/should
        // be able to do with a model element (i.e. you can't do much to a
        // search other than post it.  App developer can create model element
        // by specification of configuration for most cases rather than code.
        //
        // For example, which operations are supported. Do the require a
        // session? An authetnicatedSession?
        //
        // Should created instances by posted right away or reserved for "sync"
        // time (the latter, presumably).

        // this.validator = new mlSchema.Validator(this.schema)
