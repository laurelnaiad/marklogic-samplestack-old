define(['app/module'], function (module) {

  module.controller('searchCtlr', [

    '$scope',
    function ($scope) {
      $scope.setPageTitle('search');

      $scope.ds = {
        query: {
          text: 'testy'
        }
      };

    }

  ]);

});
