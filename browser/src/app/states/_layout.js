/*
app/states/_layout.js
 */
define(['app/module'], function (module) {

  module.controller('layoutCtlr', [

    '$scope', 'appRouting', 'loginDialog',
    function ($scope, appRouting, loginDialog) {
      // TODO: this is dead code, do we need a controller?
      // $scope.collapsed = true;


      $scope.ask = function () {
        appRouting.go('ask');
      };

      $scope.openLogin = function () {
        var dialogResult = loginDialog();
      };

      $scope.user = {
        displayName: 'John Snippet',
        email: 'user@example.com',
        accountType: 'Contributor',
        dateCreated: 'April 1, 2014'
      };

    }

  ]);

});
