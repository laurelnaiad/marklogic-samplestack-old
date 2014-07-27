define(['app/module'], function (module) {

  /*
   * @ngdoc directive
   * @name ssFacetTags
   * @restrict E
   *
   * @description
   * Directive for displaying a section of selectable tags.
   */
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
        // Expose to $parent scope since button is outside of directive template
        $scope.$parent.tagsScope = $scope;
      },
      link: function (scope, element, attrs) {
        element.addClass('ss-facet-tags');
        var index;

        var emitTagNames = function () {
          scope.$emit(
            'tagsChange',
            {
              tags: scope.selTags.map(function (tag) {
                return tag.name;
              })
            }
          );
        };

        scope.onMenuSelect = function ($item, $model, $label) {
          // Add to selected (if not there already)
          if (scope.selTags.indexOf($item) === -1) {
            scope.selTags.push($item);
            emitTagNames();
          }
          // Remove from unselected
          index = scope.unselTags.indexOf($item);
          if (index > -1) {
            scope.unselTags.splice(index, 1);
          }
          scope.selected = '';

        };

        scope.clicked = function (tag) {
          // Selection
          if (scope.unselTags.indexOf(tag) > -1) {
            scope.selTags.push(tag);
            emitTagNames();
            index = scope.unselTags.indexOf(tag);
            if (index > -1) {
              scope.unselTags.splice(index, 1);
            }
          }
          // Deselection
          else if (scope.selTags.indexOf(tag) > -1) {
            scope.unselTags.push(tag);
            index = scope.selTags.indexOf(tag);
            if (index > -1) {
              scope.selTags.splice(index, 1);
              emitTagNames();
            }
          }
        };

        var onResults = function (tagFacetValues) {
          // Set up arrays for tags: all, unselected, selected
          // @todo Get tags from service
          scope.tags = angular.copy(tagFacetValues);
          scope.unselTags = scope.tags;
          scope.selTags = scope.params.tags ?
              scope.params.tags
                  .filter(function (tag) {
                    return scope.tags[tag];
                  })
                  .map(function (tag) {
                    return scope.tags[tag];
                  }) :
              [];

          scope.selected = ''; // For typeahead

          // Sort precedence
          scope.sort = ['-count', 'name'];

          // Number of tags to display in unselected list
          scope.tagLimit = attrs.numTags;
        };
        scope.$watch(
          'main.results.facets.tag.facetValues',
          function (tagFacetValues) {
            onResults(tagFacetValues || []);
          },
          true
        );

      }
    };
  });
});
