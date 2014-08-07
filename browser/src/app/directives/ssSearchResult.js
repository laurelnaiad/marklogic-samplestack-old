define(['app/module'], function (module) {

  /**
   * @ngdoc directive
   * @name ssSearchResult;
   * @restrict E
   *
   * @description
   * TBD
   *
   */

  module.directive('ssSearchResult', [
    function () {
      return {
        restrict: 'E',
        templateUrl: '/app/directives/ssSearchResultTemplate.html',
        link: function (scope) {
          scope.showContributor = function (doc) {
            scope.$emit(
              'showContributor',
              {
                contributorId: doc.content.owner.id
              }
            );
          };
        }
      };
    }
  ]);
});
