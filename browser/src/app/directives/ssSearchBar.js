define(['app/module'], function (module) {

  /*
   * @ngdoc directive
   * @name ssSearchBar
   * @restrict E
   *
   * @description
   * Directive for displaying a search input form.
   */
  module.directive('ssSearchBar', function () {
    return {
      restrict: 'E',
      templateUrl: '/app/directives/ssSearchBarTemplate.html',
      controller: function ($scope) {

        // controller stuff

      },
      link: function (scope, element, attrs) {

        // link stuff

        // scope.$watch(
        //   'search.results',
        //   function (results) {
        //     onResults(results || {});
        //   },
        //   true
        // );

      }
    };
  });
});
