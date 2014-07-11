define(['app/module'], function (module) {

  module.controller('exploreCtlr', [

    '$scope', 'userDialog',
    function ($scope, userDialog) {

      $scope.setPageTitle('explore');

      $scope.openUser = function (userID) {
        var dialogResult = userDialog(userID);
      };

    }


  ]);

});
