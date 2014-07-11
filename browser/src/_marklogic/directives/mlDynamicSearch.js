define(['_marklogic/module'], function (module) {
  // parrent directive for coordination of dynamic search features
  module.directive('mlDynamicSearch', function () {
    return {
      restrict: 'A',
      scope: {
        dynamicSearch: '=mlDynamicSearch'
      },
      controller: function ($scope) {
        $scope.dynamicSearch = $scope.dynamicSearch || {};
        this.scope = $scope;

      }

    };
  });

  // allows generic two-way binding with a property of dynamic search
  // for the most part, we will provide custom directives where we can be
  // more helpful and they seem to be generally useful
  module.directive('mlDsBind', function () {
    return {
      restrict: 'A',
      require: '^mlDynamicSearch',
      scope: {
        mlDsBind: '@',
        mlDsValue: '='
      },
      link: function (scope, element, attrs, dsCtlr) {
        scope.$watch('mlDsValue', function (val) {
          dsCtlr.scope.dynamicSearch[scope.mlDsBind] = val;
        });
        dsCtlr.scope.$watch('dynamicSearch.' + scope.mlDsBind, function (val) {
          scope.mlDsValue = val;
        });
      }
    };
  });

});
