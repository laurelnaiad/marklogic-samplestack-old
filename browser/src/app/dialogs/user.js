define(['app/module'], function (module) {

  module.controller('userDialogCtlr', [
    '$scope', '$modalInstance',
    function ($scope, $modalInstance) {

      $scope.cancel = function () {
        $modalInstance.dismiss();
      };

    }
  ]);

  module.factory('userDialog', [
    '$modal',
    function ($modal) {
      return function () {
        return $modal.open({
          templateUrl : '/app/dialogs/user.html',
          controller : 'userDialogCtlr'
        });
      };
    }
  ]);

});


