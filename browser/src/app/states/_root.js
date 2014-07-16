/*
app/states/_root.js
 */
define(['app/module'], function (module) {

  module.controller('rootCtlr', [

    // TODO: unstub data

    '$scope', '$rootScope', 'mlStore',
    function ($scope, $rootScope, mlStore) {

      $scope.setPageTitle = function (title) {
        $rootScope.pageTitle = title;
      };

      $rootScope.store = mlStore;
    }

  ]);

});
