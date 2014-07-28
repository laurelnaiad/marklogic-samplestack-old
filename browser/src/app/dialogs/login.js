define(['app/module'], function (module) {

  module.controller('loginDialogCtlr', [

    '$scope',
    '$modalInstance',
    'ssSession',
    'mlAuth',
    function (
      $scope,
      $modalInstance,
      ssSession,
      mlAuth
    ) {

      $scope.session = ssSession.create();

      $scope.authenticate = function () {
        mlAuth.authenticate($scope.session).then(
          onAuthSuccess,
          onAuthFailure
        );
      };

      var onAuthSuccess = function (user) {
        $modalInstance.close(user);
      };

      var onAuthFailure = function (reason) {
        // $scope.doSomethingWithTheReasonToIndicateSituationToUser
        /* jshint ignore:start */
        alert('fail: ' + JSON.stringify(reason));
        /* jshint ignore:end */
      };


      $scope.cancel = function () {
        $modalInstance.dismiss();
      };

    }
  ]);

  module.factory('loginDialog', [
    '$modal',
    function ($modal) {
      return function () {
        return $modal.open({
          templateUrl : '/app/dialogs/login.html',
          controller : 'loginDialogCtlr'
        }).result;
      };
    }
  ]);

});
