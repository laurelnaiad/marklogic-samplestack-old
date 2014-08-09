define(['app/module','mocks/index'], function (module,mocksIndex) {

  /**
   * @ngdoc state
   * @name explore
   *
   * @description
   * TBD
   *
   */

  module.controller('exploreCtlr', [

    '$scope',
    'appRouting',
    'ssSearch',
    'allTagsDialog',
    function (
      $scope,
      appRouting,
      ssSearch,
      allTagsDialog
    ) {

      var dasherize = function (str) {
        return str && str.length ?
          str.trim()
            .replace(/-/g, '%2D')
            .replace(/ /g, '-') :
          null;
      };

      var dedasherize = function (str) {
        return str && str.length ?
          str.trim()
            .replace(/-/g, ' ')
            .replace(/%2D/g, '-')
            .trim() :
          null;
      };

      var runSearch = function () {
        var newStateParams = $scope.search.getStateParams();
        if (newStateParams.q) {
          newStateParams.q = dasherize(newStateParams.q);
        }
        appRouting.updateQueryParams(newStateParams);

        $scope.search.post().$ml.waiting.then(
          function () {
            try {
              $scope.search.results.items.forEach(function (item) {
                if (item.content.body && item.content.body.length > 400) {
                  item.content.body = item.content.body.substring(0,400) +
                      '...';
                }
              });
            }
            finally {
              setHandlers();
            }
          },
          function (reason) {
            setHandlers();
            $scope.fail = reason;
          }
        );
      };

      $scope.setPageTitle('explore');

      ssSearch.create({}).attachScope($scope, 'search');
      var params = angular.copy(appRouting.params);
      if (params.q) {
        dedasherize(params.q);
      }
      $scope.search.assignStateParams(params);

      $scope.searchbarText = $scope.search.criteria.q;

      $scope.$on('pageChange', function (evt, arg) {
        $scope.params.page = arg.newPage;
      });

      $scope.$on('tagsChange', function (evt, arg) {
        $scope.params.tags = arg.tags;
      });

      $scope.setQueryText = function () {
        $scope.search.criteria.q = $scope.searchbarText;
      };

      $scope.$watch('store.session.id', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.params.sessionId = newVal;
        }
      });

      var setHandlers = function () {
        var unregister = $scope.$watch(
          'params',
          function (newVal, oldVal) {
            if (newVal !== oldVal) {
              unregister();
              runSearch();
            }
          },
          true
        );
      };

      if ($scope.initializing) {
        $scope.initializing.then(runSearch);
      }
      else {
        runSearch();
      }

      $scope.openAllTags = function () {
        // Open dialog and pass in tags
        var dialogResult = allTagsDialog(
          angular.copy($scope.unselTags),
          angular.copy($scope.selTags)
        );

        dialogResult.result.then(
          // On success, save tag state based on selection in dialog
          function (data) {
            $scope.unselTags = data.unselTags;
            $scope.selTags = data.selTags;
            // cheapy hack for now
            $scope.$emit('tagsChange', { tags: $scope.selTags });
          }
        );

      };

    }

  ]);

});
