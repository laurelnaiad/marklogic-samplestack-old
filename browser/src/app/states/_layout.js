/*
app/states/_layout.js
 */
define(['app/module'], function (module) {

  module.controller('layoutCtlr', [
    '$scope', 'appRouting',
    function ($scope, appRouting) {
      $scope.ask = function () {
        appRouting.go('ask');
      };
    }

  ]);
});
