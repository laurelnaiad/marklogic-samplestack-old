/*
app/states/_root.js
 */
define(['app/module'], function (module) {

  module.controller('rootCtlr', [

    // TODO: unstub data

    '$scope', '$rootScope', 'mlStore', 'stubData',
    function ($scope, $rootScope, mlStore, stubData) {
      $scope.searchResults = stubData;

      $scope.setPageTitle = function (title) {
        $rootScope.pageTitle = title;
      };

      $rootScope.store = mlStore;
    }

  ]);

});
