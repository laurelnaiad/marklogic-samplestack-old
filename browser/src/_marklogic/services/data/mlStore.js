define(['_marklogic/module'], function (module) {

  module.provider('mlStore', [

    function (
    ) {
      var svc = {};

      this.$get = [
        '$rootScope',
        function ($rootScope) {
          $rootScope.store = svc;
          return svc;
        }
      ];

    }
  ]);
});
