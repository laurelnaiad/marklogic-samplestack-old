define(['app/module'], function (module) {

  module.controller('askCtlr', [

    '$scope', 'postDialog',
    function ($scope, postDialog) {

      $scope.setPageTitle('ask');

      $scope.post = function () {
        var dialogResult = postDialog();
      }

    }

  ]);

});
