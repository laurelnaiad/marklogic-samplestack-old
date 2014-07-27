define(['app/module'], function (module) {

  module.controller('askCtlr', [

    '$scope', 'appRouting',
    function ($scope, appRouting) {

      $scope.setPageTitle('ask');

      $scope.question = 'This is my code:\n```\nx = (question) ->\n' +
          '  new String(question)\n' +
          'console.log x "why use a constructor for a string?"\n```\n';

      $scope.post = function () {
        appRouting.go('qnaDoc');
      };

    }

  ]);

});
