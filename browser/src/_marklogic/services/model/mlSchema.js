define([
  '_marklogic/module', './_jsonschema.browserify'
], function (module, jsonschema) {

  module.factory('mlSchema', [

    // deps tbd
    function (

    ) {

      function MlSchema () {
        var validator = new jsonschema.Validator();

        this.addSchema = function (schema) {
          validator.addSchema(schema);
        };


        this.validate = function (instance, schema) {
          return validator.validate(instance, schema);
        };
      }

      return new MlSchema();

    }

  ]);
});
