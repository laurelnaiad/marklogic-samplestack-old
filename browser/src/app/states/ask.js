define(['app/module'], function (module) {

  module.controller('askCtlr', [

    '$scope',
    function ($scope) {
      $scope.setPageTitle('ask');
      $scope.question = 'This is my code:\n```\nx = (question) ->\n' +
          '  new String(question)\n' +
          'console.log x "why use a constructor for a string?"\n```\n';
    }

  ]);

});
