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
    'mlSearch',
    'allTagsDialog',
    function (
      $scope,
      appRouting,
      mlSearch,
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

      var getTypedParams = function (stateParams) {
        return {
          q: dedasherize(appRouting.params.q),
          page: appRouting.params.page ? parseInt(appRouting.params.page) : 1,
          tags: appRouting.params.tags ?
              appRouting.params.tags.split(',').filter(function (tag) {
                return tag.trim();
              }) :
              [],
          dates: []
        };
      };

      var getDatesStateParam = function () {
        return 'tbd-soon';
      };

      var getStateParams = function (typedParams) {
        return {
          q: dasherize(typedParams.q),
          page: typedParams.page ? typedParams.page : undefined,
          tags: typedParams.tags ? typedParams.tags.join(',') : undefined,
          dates: getDatesStateParam(typedParams.dates)
        };
      };

      var getSearchSpec = function (typedParams) {

        var makeTags = function (tags) {
          var tagsAnd = [];
          tags.forEach(function (tag) {
            tagsAnd.push({
              'range-constraint-query': {
                'constraint-name': 'tag', text: tag
              }
            });
          });
          if (tagsAnd.length) {
            return { queries: tagsAnd };
          }
          else {
            return undefined;
          }
        };

        return {
          criteria: {
            query: {
              qtext: typedParams.q,
              'and-query': makeTags(typedParams.tags)
            },
            start: 1 + (typedParams.page - 1) * 10
          }
        };
      };

      var runSearch = function () {
        $scope.search.assignData(getSearchSpec($scope.params));
        appRouting.updateQueryParams(
          getStateParams($scope.params),
          $scope
        );

        $scope.search.post().$ml.waiting.then(
          function () {
            try {
              $scope.search.results.items.forEach(function (item) {
                if (item.content.body && item.content.body.length > 400) {
                  item.content.body = item.content.body.substring(0,400) +
                      '...';
                }
              });
              $scope.dateData = mocksIndex.searchObj;
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
      $scope.params = getTypedParams(appRouting.params);
      $scope.searchbarText = $scope.params.q;

      $scope.$on('pageChange', function (evt, arg) {
        $scope.params.page = arg.newPage;
      });

      $scope.$on('tagsChange', function (evt, arg) {
        $scope.params.tags = arg.tags;
      });

      $scope.setQueryText = function () {
        $scope.params.q = $scope.searchbarText;
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

      var initSearch = function () {
        mlSearch.create().attachScope($scope, 'search');
        runSearch();
      };

      if ($scope.initializing) {
        $scope.initializing.then(initSearch);
      }
      else {
        initSearch();
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
