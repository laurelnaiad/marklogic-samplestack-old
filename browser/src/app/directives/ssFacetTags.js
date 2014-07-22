define(['app/module'], function (module) {
  module.directive('ssFacetTags', function () {
    return {
      restrict: 'E',
      templateUrl: '/app/directives/ssFacetTagsTemplate.html',
      controller: function ($scope) {
        $scope.clearTags = function () {
          for (var k = 0; k < $scope.selTags.length; k++) {
            $scope.unselTags.push($scope.selTags[k]);
          }
          $scope.selTags = [];
        };
        $scope.$parent.tagsScope = $scope;
      },
      link: function (scope, element, attrs) {

        scope.tags = scope.searchResultsStatic.facets.tags;
        element.addClass('ss-facet-tags');

        scope.unselTags = scope.unselTags;
        scope.selTags = [];
        scope.selected = '';
        scope.predicate = ['-count', 'name'];

        scope.onMenuSelect = function ($item, $model, $label) {
          // Add to selected (if not there already)
          if (scope.selTags.indexOf($item) === -1) {
            scope.selTags.push($item);
          }
          // Remove from unselected
          var index = scope.unselTags.indexOf($item);
          if (index > -1) {
            scope.unselTags.splice(index, 1);
          }
          scope.selected = '';
        };

        scope.clicked = function (tag) {
          // Unselected tag clicked
          if (scope.unselTags.indexOf(tag) > -1) {
            scope.selTags.push(tag);
            var index = scope.unselTags.indexOf(tag);
            if (index > -1) {
              scope.unselTags.splice(index, 1);
            }
          }
          // Selected tag clicked
          else if (scope.selTags.indexOf(tag) > -1) {
            scope.unselTags.push(tag);
            var index = scope.selTags.indexOf(tag);
            if (index > -1) {
              scope.selTags.splice(index, 1);
            }
          }
        };

      }
    };
  });
});
