define(['app/module'], function (module) {

  module.controller('qnaDocCtlr', [

    '$scope',
    function ($scope) {
      $scope.setPageTitle('doc');

      // Sort settings
      $scope.sorts = [
        {
          label: 'newest',
          value: ['creationDate']
        },
        {
          label: 'votes',
          value: ['']
        }
      ];
      $scope.selectedSort = $scope.sorts[1]; // Default sort

     /*
      * Set the tag sort based on clicked element.
      */
      $scope.setSort = function () {
        $scope.selectedSort = this.sort;
        console.log('sort: ' + this.sort.label);
        // emit()
      };

     /*
      * Tally a vote.
      */
      $scope.vote = function (num) {
        console.log('vote: ' + num);
        // emit()
      };

    }

  ]);

});
