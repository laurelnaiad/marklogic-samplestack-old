/*
 * Module for displaying the All Tags dialog for Samplestack.
 * Based on UI Bootstrap Modal service.
 * @ngdoc overview
 * @see http://angular-ui.github.io/bootstrap/#/modal
 * @requires app/module, the Samplestack application module
 */
define(['app/module'], function (module) {

 /*
  * Controller for the All Tags dialog. Used by the `allTagsDialog` service.
  * @name allTagsDialogCtlr
  */
  module.controller('allTagsDialogCtlr', [
    '$scope', '$filter', '$modalInstance', 'unselTags', 'selTags',
     /*
      * @param $scope Scope object for the controller
      * @param $modalInstance Instance object for modal dialog
      * @param unselTags Array of unselected tag objects
      * @param selTags Array of selected tag objects
      */
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

     /*
      * Handle a click event for a tag checkbox.
      * @param tag The clicked tag element
      */
      $scope.clicked = function (tag) {
        // Selection
        var index;
        if ($scope.unselTags.indexOf(tag) > -1) {
          $scope.selTags.push(tag);
          index = $scope.unselTags.indexOf(tag);
          if (index > -1) {
            $scope.unselTags.splice(index, 1);
          }
        }
        // Deselection
        else if ($scope.selTags.indexOf(tag) > -1) {
          $scope.unselTags.push(tag);
          index = $scope.selTags.indexOf(tag);
          if (index > -1) {
            $scope.selTags.splice(index, 1);
          }
        }
      };

     /*
      * Submit the data and close the dialog.
      */
      $scope.submit = function () {
        $modalInstance.close({
          unselTags: $scope.unselTags,
          selTags: $scope.selTags
        });
      };

     /*
      * Cancel the dialog.
      */
      $scope.cancel = function () {
        $modalInstance.dismiss();
      };

     /*
      * Set the tag sort based on clicked element.
      */
      $scope.setSort = function () {
        $scope.selectedSort = this.sort;
        $scope.currentPage = 0; // @todo not working, paging stays same???
      };

     /*
      * Handle typeahead selection.
      * @param $item Selected object: `{name: 'foo', count: 3}`
      * @param $model Selected value: `3`
      * @param $label Selected label: `'foo'`
      * @see `dialogs/allTags.js` for similar method
      */
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
        $scope.selected = ''; // @todo not working, typeahead doesn't clear???
      };

    }
  ]);

 /*
  * Factory for the All Tags dialog.
  * @ngdoc service
  * @name allTagsDialog
  */
  module.factory('allTagsDialog', [
    '$modal',
   /*
    * @param $modal The UI Bootstrap Modal service.
    */
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
        });
      };
    }
  ]);

 /*
  * Filter that returns the starting element for columnar display of tags.
  * @ngdoc filter
  * @name startFrom
  * @param tags An array of tags
  * @param startIndex Starting index based on current page
  * @param colOffset Tag index offset based on the column index
  * @returns The starting tag for the column
  */
  module.filter('startFrom', function () {
    return function (tags, startIndex, colOffset) {
      var index = startIndex + colOffset;
      return tags.slice(index);
    };
  });

});


