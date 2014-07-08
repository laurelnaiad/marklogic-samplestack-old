define(['app/module'], function (module) {

  module.controller('loginDialogCtlr', ['$scope', '$modal',
    function ($scope, $modal) {
      $scope.open = function () {
        $modal.open({
          templateUrl: '/app/dialogs/login.html',
          controller: function ($scope, $modalInstance) {
            $scope.login = function () {
              // @todo Log the user in
              $modalInstance.close();
            };
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }
        });
      };
    }
  ]);

});


