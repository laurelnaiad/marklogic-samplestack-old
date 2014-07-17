define(['app/module'], function (module) {

  module.controller('loginDialogCtlr', [

    '$scope', '$modalInstance', 'mlUserModel', 'mlAuth',
    function ($scope, $modalInstance, mlUserModel, mlAuth) {

      $scope.model = {
        user: mlUserModel.create()
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

      $scope.authenticate = function () {
        mlAuth.idAuthenticate($scope.model.user).then(
          onAuthSuccess,
          onAuthFailure
        );
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
        });
      };
    }
  ]);

});
