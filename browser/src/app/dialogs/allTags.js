define(['app/module'], function (module) {

  module.controller('allTagsDialogCtlr', [
    '$scope', '$modalInstance', 'tags', 'predicate',
    function ($scope, $modalInstance, tags, predicate) {

      $scope.tags = tags;
      $scope.predicate = predicate;

      $scope.cancel = function () {
        $modalInstance.dismiss();
      };

    }
  ]);

  module.factory('allTagsDialog', [
    '$modal',
    function ($modal) {
      return function (tags) {
        return $modal.open({
          templateUrl : '/app/dialogs/allTags.html',
          controller : 'allTagsDialogCtlr',
          resolve: {
            tags: function () {
              return tags;
            },
            predicate: function () {
              return ['-count', 'name'];
            }
          }
        });
      };
    }
  ]);

});


