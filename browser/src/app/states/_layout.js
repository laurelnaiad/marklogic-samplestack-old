/*
app/states/_layout.js
 */
define(['app/module'], function (module) {

  module.controller('layoutCtlr', [

    '$scope', 'appRouting', 'loginDialog',
    function ($scope, appRouting, loginDialog) {
      // TODO: this is dead code, do we need a controller?
      // $scope.collapsed = true;


      $scope.ask = function () {
        appRouting.go('ask');
      };

      $scope.openLogin = function () {
        var dialogResult = loginDialog();
      };

      // @todo generalize with user popover
      var loginText = function () {
        // @todo return formatted user text
        var text = '<strong>Email</strong> john@marklogic.com<br />';
        text += '<strong>Account Type</strong> Contributor';
        return text;
      };

      $scope.loginPopover = loginText();

    }

  ]);

});
