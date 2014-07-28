/*
app/states/_root.js
 */
define(['app/module'], function (module) {

  module.controller('rootCtlr', [

    '$scope',
    '$rootScope',
    '$q',
    'mlAuth',
    'loginDialog',
    function (
      $scope,
      $rootScope,
      $q,
      mlAuth,
      loginDialog
    ) {

      $q.all([
        // antyhing that is required for init should happen here
        mlAuth.restoreActiveSession()
      ]).then(
        function () {
          $rootScope.initialized = true;
        }
      );

      $scope.setPageTitle = function (title) {
        $rootScope.pageTitle = title;
      };

      $scope.openLogin = function () {
        // there is a fix coming from angular-ui for the bug that is exposed
        // by closing this dialog
        loginDialog().result.then(
          function () {
            angular.noop($scope.store.session);
          },
          function () {
            angular.noop('cancelled');
          }

        );
      };

      $scope.logout = function () {
        mlAuth.logout().then(
          function () {
            angular.noop($scope.store.session);
          },
          function (reason) {
            angular.noop();
          }
        );
      };

    }

  ]);

});
