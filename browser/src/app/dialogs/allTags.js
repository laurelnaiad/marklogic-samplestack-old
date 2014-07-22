define(['app/module'], function (module) {

  module.controller('allTagsDialogCtlr', [
    '$scope', '$modalInstance', 'unselTags', 'selTags', 'predicate',
    function ($scope, $modalInstance, unselTags, selTags, predicate) {

      // Put on scope so template can access
      $scope.unselTagsAll = unselTags;
      $scope.selTagsAll = selTags;
      $scope.predicate = predicate;

      $scope.clicked = function (tag) {
        // Selection event
        if ($scope.unselTagsAll.indexOf(tag) > -1) {
          $scope.selTagsAll.push(tag);
          var index = $scope.unselTagsAll.indexOf(tag);
          if (index > -1) {
            $scope.unselTagsAll.splice(index, 1);
          }
        }
        // Deselection event
        else if ($scope.selTagsAll.indexOf(tag) > -1) {
          $scope.unselTagsAll.push(tag);
          var index = $scope.selTagsAll.indexOf(tag);
          if (index > -1) {
            $scope.selTagsAll.splice(index, 1);
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


