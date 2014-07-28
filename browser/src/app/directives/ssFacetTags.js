/*
 * Directive for displaying a section of selectable tags.
 * @ngdoc overview
 * @requires app/module, the Samplestack application module
 */
define(['app/module'], function (module) {

  /*
   * @ngdoc directive
   * @name ssFacetTags
   * @restrict E
   */
  module.directive('ssFacetTags', function () {
    return {
      restrict: 'E',
      templateUrl: '/app/directives/ssFacetTagsTemplate.html',
      controller: function ($scope) {
       /*
        * Deselect all selected tags.
        * Adds all selected tags to `unselTags` and clears `selTags`.
        */
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

        var index;
        element.addClass('ss-facet-tags');

        // Set up arrays for tags: all, unselected, selected
        // @todo Get tags from service
        scope.tags = scope.searchResults.instance.facets.tags;
        scope.unselTags = scope.tags;
        scope.selTags = [];

        scope.selected = ''; // For typeahead

        // Sort precedence
        scope.sort = ['-count', 'name'];

        // Number of tags to display in unselected list
        scope.tagLimit = attrs.numTags;

       /*
        * Handle typeahead selection.
        * @param $item Selected object: `{name: 'foo', count: 3}`
        * @param $model Selected value: `3`
        * @param $label Selected label: `'foo'`
        * @see `dialogs/allTags.js` for similar method
        */
        scope.onMenuSelect = function ($item, $model, $label) {
          // Add to selected (if not there already)
          if (scope.selTags.indexOf($item) === -1) {
            scope.selTags.push($item);
          }
          // Remove from unselected
          index = scope.unselTags.indexOf($item);
          if (index > -1) {
            scope.unselTags.splice(index, 1);
          }
          scope.selected = '';
        };

       /*
        * Handle a click event for a tag checkbox.
        * @param tag The clicked tag element
        * @see `dialogs/allTags.js` for similar method
        */
        scope.clicked = function (tag) {
          // Selection
          if (scope.unselTags.indexOf(tag) > -1) {
            scope.selTags.push(tag);
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
            }
          }
        };

      }
    };
  });
});
