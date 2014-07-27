/*
 * Directive for displaying a search result summary.
 * @ngdoc overview
 * @requires app/module, the Samplestack application module
 */
define(['app/module'], function (module) {

  /*
   * @ngdoc directive
   * @name ssSearchResult
   * @restrict E
   */
  module.directive('ssSearchResult', function () {
    return {
      restrict: 'E',
      templateUrl: '/app/directives/ssSearchResultTemplate.html',
      controller: function ($scope) {

       // some controller stuff

      },
      link: function (scope, element, attrs) {

        // some link stuff

      }
    };
  });
});
