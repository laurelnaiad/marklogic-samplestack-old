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

      $scope.openLogin = function () {
        // there is a fix coming from angular-ui for the bug that is exposed
        // by closing this dialog
        loginDialog().result.then(
          function (user) {
            angular.noop($scope.store.currentUser);
          },
          function () {
            angular.noop('cancelled or err');
          }
          
        );
      };

      $scope.logout = mlAuth.logout;

    }

  ]);

});
