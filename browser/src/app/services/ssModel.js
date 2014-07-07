define(['app/module'], function (module) {

  module.factory('ssModel', [

    'mlModel',
    function (mlModel) {
      return {
        tweedle: 'dee'

      };
    }

  ]);
});
