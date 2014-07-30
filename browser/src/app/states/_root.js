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
      var initDefer = $q.defer();
      $rootScope.initializing = initDefer.promise;

      $q.all([
        // antyhing that is required for init should happen here
        mlAuth.restoreSession()
      ]).then(
        function () {
          $rootScope.initialized = true;
          delete $rootScope.initializing;
          initDefer.resolve();
        }
      );

      $scope.setPageTitle = function (title) {
        $rootScope.pageTitle = title;
      };

      $scope.openLogin = function () {
        // there is a fix coming from angular-ui for the bug that is exposed
        // by closing this dialog
        loginDialog().then(
          function () {
            angular.noop($scope.store.session);
          },
          function () {
            angular.noop('cancelled');
          }

        );
      };

    }

  ]);

});
