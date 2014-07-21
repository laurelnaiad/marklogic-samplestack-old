/*
app/states/_layout.js
 */
define(['app/module'], function (module) {

  module.controller('layoutCtlr', [

    '$scope', 'mlAuth', 'appRouting', 'loginDialog',
    function ($scope, mlAuth, appRouting, loginDialog) {
      // TODO: this is dead code, do we need a controller?
      // $scope.collapsed = true;


      $scope.ask = function () {
        appRouting.go('ask');
      };

      $scope.openLogin = loginDialog;
      $scope.logout = mlAuth.logout;

    }

  ]);

});
