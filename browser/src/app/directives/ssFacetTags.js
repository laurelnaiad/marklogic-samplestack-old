define(['app/module'], function (module) {
  module.directive('ssFacetTags', function () {
    return {
      restrict: 'E',
      templateUrl: '/app/directives/ssFacetTagsTemplate.html',
      controller: function ($scope) {
        $scope.clearTags = function () {
          for (var k = 0; k < $scope.selectedTags.length; k++) {
            $scope.tags.push($scope.selectedTags[k]);
          }
          $scope.selectedTags = [];
        };
        $scope.$parent.tagsScope = $scope;
      },
      link: function (scope, element, attrs) {

        scope.tags = scope.searchResultsStatic.facets.tags;
        element.addClass('ss-facet-tags');

        scope.selectedTags = [];
        scope.selected = '';
        scope.predicate = ['-count', 'name'];

        scope.onMenuSelect = function ($item, $model, $label) {
          scope.selectTag($item);
          scope.selected = '';
        };

        scope.selectTag = function (tag) {
          scope.selectedTags.push(tag);
          var index = scope.tags.indexOf(tag);
          if (index > -1) {
            scope.tags.splice(index, 1);
          }
        };

        scope.deselectTag = function (tag) {
          scope.tags.push(tag);
          var index = scope.selectedTags.indexOf(tag);
          if (index > -1) {
            scope.selectedTags.splice(index, 1);
          }
        };

      }
    };
  });
});
