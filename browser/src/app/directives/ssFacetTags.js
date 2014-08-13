define(['app/module'], function (module) {

  /**
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
      templateUrl: '/app/directives/ssFacetTags.html',
      scope: {
        criteria: '=',       // Tags in the selection criteria
        results: '=',        // Tags in the results
        totals: '=',         // Object with total data
        tagLimit: '=numTags' // Num tags to show in unsel list
      },
      link: function (scope, element, attrs) {
        element.addClass('ss-facet-tags');
        scope.selected = ''; // For typeahead
        // Sort precedence
        scope.sort = ['-count', 'name'];

        var resetSelections = function () {
          // Start by moving all tags in results to unsel array
          scope.unselTags = angular.copy(scope.results);
          angular.forEach(scope.unselTags, function (tag) {
            // Ensure they all have counts
            if (!tag.count) {
              tag.count = 0;
            }
          });
          scope.selTags = {};
          if (scope.criteria.values) {
            // Cycle through tags in search criteria (the selected tags)
            scope.criteria.values.forEach(function (tagName) {
              // If tag exists in unsel array, move to sel array as-is
              if (scope.unselTags[tagName]) {
                scope.selTags[tagName] = scope.unselTags[tagName];
                delete scope.unselTags[tagName];
              }
              // Otherwise, set its counts to 0, move to sel array
              else {
                scope.selTags[tagName] = {
                  name: tagName, count: 0 , shadow: { count: 0 }
                };
              }
            });
          }
        };

       /**
        * Initialize objects, watch results object (which is tags)
        * @todo Can avoid watching same object in both unergister()
        * and initialize()?
        */
        var initialize = function () {
          scope.selTags = {};
          scope.unselTags = {};
          scope.$watch(
            'results', resetSelections, true
          );
        };

       /**
        * Handle tag selection in UI
        */
        scope.selectTag = function (tag) {
          // Do tag values exist in criteria?
          if (scope.criteria.values) {
            // Is selected tag not in the array?
            if (scope.criteria.values.indexOf(tag.name) < 0) {
              // Add tag o criteria array
              scope.criteria.values.push(tag.name);
            }
          }
          // Add tag as first value in criteria
          else {
            scope.criteria.values = [tag.name];
          }
        };

       /**
        * Handle tag deselection in UI
        */
        scope.unselectTag = function (tag) {
          // Do tag values exist in criteria?
          if (scope.criteria.values) {
            // Remove tag from criteria array
            scope.criteria.values.splice(
              scope.criteria.values.indexOf(tag.name), 1
            );
          }
        };

       /**
        * Convert object to array, for use in list display in template
        * @param {object} obj An object
        * @returns {array} An array of object property values
        */
        scope.toArray = function (obj) {
          return obj ?
              Object.keys(obj).map(function (key) { return obj[key]; }) :
              [];
        };

       /**
        * Do selected tags exist, for use in template layout
        * @returns {boolean} true if selTags object has property keys
        */
        scope.haveSelectedTags = function () {
          return scope.selTags  && Object.keys(scope.selTags).length > 0;
        };

       /**
        * Set up directive by watching results object (which is tags)
        */
        var unregister = scope.$watch('results', function (results) {
          if (results) {
            unregister();
            initialize();
          }
        });
      }
    };
  });
});
