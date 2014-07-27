/*
 * Directive for displaying the search results section.
 * @ngdoc overview
 * @requires app/module, the Samplestack application module
 */
define(['app/module'], function (module) {

  /*
   * @ngdoc directive
   * @name ssSearchResults
   * @restrict E
   */
  module.directive('ssSearchResults', function () {
    return {
      restrict: 'E',
      templateUrl: '/app/directives/ssSearchResultsTemplate.html',
      controller: function ($scope) {

        // Sort settings
        $scope.sorts = [
          {
            label: 'votes',
            value: ['']
          },
          {
            label: 'newest',
            value: ['creationDate']
          },
          {
            label: 'relevance',
            value: ['-score']
          }
        ];
        $scope.selectedSort = $scope.sorts[2]; // Default sort

       /*
        * Set the tag sort based on clicked element.
        */
        $scope.setSort = function () {
          $scope.selectedSort = this.sort;
          angular.noop('sort: ' + this.sort.label);
          // emit()
        };

      },
      link: function (scope, element, attrs) {

        // some link stuff

      }
    };
  });
});
