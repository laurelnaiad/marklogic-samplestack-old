define([
  '_marklogic/module', './_jsonschema.browserify'
], function (module, jsonschema) {

  module.factory('mlSchema', [

    // deps tbd
    function (
    
    ) {
      return {
        validator: jsonschema.Validator
      };
    }

  ]);
});
