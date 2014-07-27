/*
app/states/_root.js
 */
define(['app/module'], function (module) {

  module.controller('rootCtlr', [

    // TODO: unstub data

    '$scope', '$rootScope',
    function ($scope, $rootScope) {
      $scope.setPageTitle = function (title) {
        $rootScope.pageTitle = title;
      };
    }

  ]);

});
