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
          var index1;
          var index2;

          // Unselected tag clicked
          if (scope.unselTags.indexOf(tag) > -1) {
            scope.selTags.push(tag);
            index1 = scope.unselTags.indexOf(tag);
            if (index1 > -1) {
              scope.unselTags.splice(index1, 1);
            }
          }
          // Selected tag clicked
          else if (scope.selTags.indexOf(tag) > -1) {
            scope.unselTags.push(tag);
            index2 = scope.selTags.indexOf(tag);
            if (index2 > -1) {
              scope.selTags.splice(index2, 1);
            }
          }
        };

      }
    };
  });
});
