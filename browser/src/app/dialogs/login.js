define(['app/module'], function (module) {

  module.controller('loginDialogCtlr', [

    '$scope',
    '$modalInstance',
    'SsCredentialsModel',
    'SsContributorModel',
    'mlAuth',
    function (
      $scope,
      $modalInstance,
      SsCredentialsModel,
      SsContributorModel,
      mlAuth
    ) {

      $scope.credentials = new SsCredentialsModel();

      $scope.authenticate = function () {
        mlAuth.authenticate($scope.credentials).then(
          onAuthSuccess,
          onAuthFailure
        );
      };

      var onAuthSuccess = function (user) {
        $modalInstance.close({});
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
        });
      };
    }
  ]);

});
