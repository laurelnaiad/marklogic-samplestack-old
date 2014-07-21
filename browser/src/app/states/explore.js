define(['app/module'], function (module) {

  module.controller('exploreCtlr', [

    '$scope',
    '$stateParams',
    'appRouting',
    'mlSearch',
    'MlSearchSpecModel',
    'mlUtil',
    function (
      $scope,
      $stateParams,
      appRouting,
      mlSearch,
      MlSearchSpecModel,
      mlUtil
    ) {
      $scope.setPageTitle('explore');

      var parsedParams = {};

      parsedParams.queryText = $stateParams.q ?
            $stateParams.q
                .replace(/-/g, ' ')
                .replace(/%2D/g, '-')
                .trim() :
            null;

      $scope.searchSpec = new MlSearchSpecModel(parsedParams);
      $scope.searchResults = mlSearch.searchOne($scope.searchSpec);

      $scope.applyQueryText = function () {
        appRouting.go(
          'explore',
          {
            q: $scope.searchParams.value.queryText
                .trim()
                .replace(/-/g, '%2D')
                .replace(/ /g, '-')
          }
        );
      };

    }

  ]);

});
