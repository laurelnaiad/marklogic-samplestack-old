define(['app/module'], function (module) {

  module.controller('allTagsDialogCtlr', [
    '$scope', '$modalInstance', 'unselTags', 'selTags', 'predicate',
    function ($scope, $modalInstance, unselTags, selTags, predicate) {

      // Put on scope so template can access
      $scope.unselTagsAll = unselTags;
      $scope.selTagsAll = selTags;
      $scope.predicate = predicate;

      $scope.clicked = function (tag) {
        var index1;
        var index2;

        // Selection event
        if ($scope.unselTagsAll.indexOf(tag) > -1) {
          $scope.selTagsAll.push(tag);
          index1 = $scope.unselTagsAll.indexOf(tag);
          if (index1 > -1) {
            $scope.unselTagsAll.splice(index1, 1);
          }
        }
        // Deselection event
        else if ($scope.selTagsAll.indexOf(tag) > -1) {
          $scope.unselTagsAll.push(tag);
          index2 = $scope.selTagsAll.indexOf(tag);
          if (index2 > -1) {
            $scope.selTagsAll.splice(index2, 1);
          }
        }
      };

      $scope.ok = function () {
        $modalInstance.close({
          unselTagsAll: $scope.unselTagsAll,
          selTagsAll: $scope.selTagsAll
        });
      };

      $scope.cancel = function () {
        $modalInstance.dismiss();
      };

    }
  ]);

  module.factory('allTagsDialog', [
    '$modal',
    function ($modal) {
      return function (unselTags, selTags) {
        return $modal.open({
          templateUrl : '/app/dialogs/allTags.html',
          controller : 'allTagsDialogCtlr',
          // Pass data into controller
          resolve: {
            unselTags: function () {
              return unselTags;
            },
            selTags: function () {
              return selTags;
            },
            predicate: function () {
              return ['name'];
            }
          }
        });
      };
    }
  ]);

});
