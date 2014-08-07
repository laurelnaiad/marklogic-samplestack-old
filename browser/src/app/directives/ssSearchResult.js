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
    '$parse',
    function ($parse) {
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
          scope.isLocalOwner = function (item) {
            var n = item.content.owner ?
                item.content.owner.displayName :
                '';
            return n === 'joeUser' || n === 'maryAdmin';
          };

          scope.soOwnerId = function (item) {
            return scope.isLocalOwner(item) ?
                null :
                $parse('content.owner.id')(item);
          };

          scope.soUserName = function (item) {
            return scope.soOwnerId(item) ?
                item.content.owner.displayName :
                null;
          };

          scope.soUserLink = function (item) {
            return scope.soOwnerId(item) && item.content.owner.id ?
                'http://stackoverflow.com/users/' + item.content.owner.id :
                null;
          };

          scope.noValidUser = function (item) {
            var noneValid = !scope.soOwnerId(item) && !scope.isLocalOwner(item);
            return noneValid;
          };

        }
      };
    }
  ]);
});
