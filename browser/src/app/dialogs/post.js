define(['app/module'], function (module) {

  module.controller('postDialogCtlr', [
    '$scope', '$modalInstance', 'appRouting',
    function ($scope, $modalInstance, appRouting) {

      $scope.cancel = function () {
        $modalInstance.dismiss();
      };

      $scope.ok = function () {
        $modalInstance.dismiss();
        appRouting.go('explore');
      }

    }
  ]);

  module.factory('postDialog', [
    '$modal',
    function ($modal) {
      return function () {
        return $modal.open({
          templateUrl : '/app/dialogs/post.html',
          controller : 'postDialogCtlr'
        });
      };
    }
  ]);

});


