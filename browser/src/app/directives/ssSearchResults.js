define(['app/module'], function (module) {

  /**
   * @ngdoc directive
   * @name ssSearchResults
   * @restrict E
   *
   * @description
   * TBD
   *
   */
  module.directive('ssSearchResults', function () {
    return {
      restrict: 'E',
      templateUrl: '/app/directives/ssSearchResultsTemplate.html',
      controller: function ($scope) {

        // Paging settings
        $scope.currentPage = 0;
        $scope.Math = window.Math; // Make Math functions avail to template

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

        $scope.setSort = function () {
          $scope.selectedSort = this.sort;
          $scope.$emit('sort', { sort: this.sort });
        };

      },
      link: function (scope, element, attrs) {
        scope.incrementPage = function () {
          scope.currentPage += 1;
          scope.$emit('pageChange', { pageNum: scope.currentPage });
        };
        scope.incrementPage = function () {
          scope.currentPage -= 1;
          scope.$emit('pageChange', { pageNum: scope.currentPage });
        };
      }
    };
  });
});
