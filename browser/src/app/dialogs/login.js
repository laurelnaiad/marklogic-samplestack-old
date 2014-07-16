define(['app/module'], function (module) {

  module.controller('loginDialogCtlr', [
    '$scope', '$modalInstance',
    function ($scope, $modalInstance) {

      $scope.login = function () {
        // @todo Log the user in
        $modalInstance.close();
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


