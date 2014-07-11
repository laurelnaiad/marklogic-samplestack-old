define(['app/module'], function (module) {

  module.controller('exploreCtlr', [

    '$scope',
    function ($scope) {

      $scope.setPageTitle('explore');

      // @todo generalize with login popover
      var userText = function () {
        // @todo return formatted user text
        var text = '<strong>Email</strong> user@example.com<br />';
        text += '<strong>Account Type</strong> Contributor';
        return text;
      };

      $scope.userPopover = userText();

    }


  ]);

});
