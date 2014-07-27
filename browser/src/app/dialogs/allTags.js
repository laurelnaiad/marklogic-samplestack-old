define(['app/module'], function (module) {

  module.controller('allTagsDialogCtlr', [
    '$scope', '$filter', '$modalInstance', 'unselTags', 'selTags',
    function ($scope, $filter, $modalInstance, unselTags, selTags) {

      // Tag settings
      $scope.unselTags = unselTags;
      $scope.selTags = selTags;
      $scope.tags = unselTags.concat(selTags);
      $scope.selected = ''; // For typeahead

      // Layout settings
      var numCols = 3;
      $scope.arrCols = []; // For template ng-repeat
      for (var i = 0; i < numCols; i++) {
        $scope.arrCols.push(i);
      }
      $scope.tagsPerCol = 2;

      // Paging settings
      $scope.currentPage = 0;
      $scope.pageSize = numCols * $scope.tagsPerCol;
      $scope.totalPages = Math.ceil($scope.tags.length / $scope.pageSize);

      // Sort settings
      $scope.sorts = [
        {
          label: 'count',
          value: ['-count', 'name']
        },
        {
          label: 'name',
          value: ['name']
        }
      ];
      $scope.selectedSort = $scope.sorts[1]; // Default sort

      $scope.clicked = function (tag) {
        // Selection
        var index;
        if ($scope.unselTags.indexOf(tag) > -1) {
          $scope.selTags.push(tag);
          index = $scope.unselTags.indexOf(tag);
          $scope.unselTags.splice(index, 1);
        }
        // Deselection
        else {
          $scope.unselTags.push(tag);
          index = $scope.selTags.indexOf(tag);
          $scope.selTags.splice(index, 1);
        }
      };

      $scope.submit = function () {
        $modalInstance.close({
          unselTags: $scope.unselTags,
          selTags: $scope.selTags
        });
      };

      $scope.cancel = function () {
        $modalInstance.dismiss();
      };

      $scope.setSort = function () {
        $scope.selectedSort = this.sort;
        $scope.currentPage = 0; // TODO not working, paging stays same???
      };

      $scope.onMenuSelect = function ($item, $model, $label) {
        // Add to selected (if not there already)
        if ($scope.selTags.indexOf($item) === -1) {
          $scope.selTags.push($item);
        }
        // Remove from unselected
        var index = $scope.unselTags.indexOf($item);
        if (index > -1) {
          $scope.unselTags.splice(index, 1);
        }
        $scope.selected = ''; // TODO not working, typeahead doesn't clear???
      };

    }
  ]);

  /**
   * @ngdoc dialog
   * @name allTagsDialog
   *
   * @description
   * Someone should really describe me quite soon.
   *
   * This this is *too* quick!
   *
   * Is it dead?
   *
   * ### No, I'm not dead yet!
   *
   * ##### But I do appear to be dying.
   *
   */

  module.factory('allTagsDialog', [
    '$modal',
    function ($modal) {
      return function (unselTags, selTags) {
        return $modal.open({
          templateUrl : '/app/dialogs/allTags.html',
          controller : 'allTagsDialogCtlr',
          // Data to pass into controller
          resolve: {
            unselTags: function () {
              return unselTags;
            },
            selTags: function () {
              return selTags;
            }
          }
        }).result;
      };
    }
  ]);

  module.filter('startFrom', function () {
    return function (tags, startIndex, colOffset) {
      var index = startIndex + colOffset;
      return tags.slice(index);
    };
  });

});
