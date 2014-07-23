define(['app/module'], function (module) {

  module.controller('exploreCtlr', [

    '$scope',
    '$stateParams',
    'appRouting',
    'mlSearch',
    'MlSearchSpecModel',
    'allTagsDialog',
    'mlUtil',
    function (
      $scope,
      $stateParams,
      appRouting,
      mlSearch,
      MlSearchSpecModel,
      allTagsDialog,
      mlUtil
    ) {
      $scope.setPageTitle('explore');

      var parsedParams = {};

      parsedParams.queryText = $stateParams.q ?
            $stateParams.q
                .replace(/-/g, ' ')
                .replace(/%2D/g, '-')
                .trim() :
            null;

      $scope.searchSpec = new MlSearchSpecModel(parsedParams);
      $scope.searchResults = mlSearch.searchOne($scope.searchSpec);

      $scope.applyQueryText = function () {
        appRouting.go(
          'explore',
          {
            q: $scope.searchParams.value.queryText
                .trim()
                .replace(/-/g, '%2D')
                .replace(/ /g, '-')
          }
        );
      };

            /*jshint ignore:start */
      $scope.searchResultsStatic = {
        'results': [
          {
            'title': 'Why do birds suddenly appear every time you are near? I\'m running MarkLogic 7.0 with geospatial and semantics enabled on Fedora 99 under an IKEA Borgsjo office desk.',
            'body': 'Tonx pour-over, readymade Pitchfork slow-carb Portland brunch Schlitz gastropub artisan. Trust fund Echo Park wayfarers Godard ethnic leggings kale chips Shoreditch Bushwick, post-ironic forage blog beard meh. Fap narwhal farm-to-table, wolf XOXO seitan four loko. Dreamcatcher banh mi try-hard Tumblr literally. Swag literally Kickstarter selfies.',
            'owner': {
              'userName': 'joeUser@marklogic.com',
              'displayName': 'Joe',
              'id': 'cf99542d-f024-4478-a6dc-7e723a51b040',
              'reputation': 999
            },
            'tags': ['birds', 'robins', 'vultures'],
            'creationDate': '2014-06-09T15:37:14.773514-07:00',
            'answers': [],
            'comments': [],
            'id': '/qna/1.json'
          },
          {
            'title': 'Why do avians suddenly appear every time you are near? I\'m running MarkLogic 6.0 with beverages enabled on Ubuntu 60 under a Macy\'s Doss office desk.',
            'body': 'Tonx pour-over, readymade Pitchfork slow-carb Portland brunch Schlitz gastropub artisan. Trust fund Echo Park wayfarers Godard ethnic leggings kale chips Shoreditch Bushwick, post-ironic forage blog beard meh. Fap narwhal farm-to-table, wolf XOXO seitan four loko. Dreamcatcher banh mi try-hard Tumblr literally. Swag literally Kickstarter selfies.',
            'owner': {
              'userName': 'maryUser@marklogic.com',
              'displayName': 'Mary',
              'id': 'cf99542d-f024-4478-a6dc-7e723a51b040',
              'reputation': 123
            },
            'tags': ['birds', 'robins'],
            'creationDate': '2014-05-23T15:37:14.773514-07:00',
            'answers': [],
            'comments': [],
            'id': '/qna/2.json'
          },
          {
            'title': 'Why do flying creatures suddenly appear every time you are near? I\'m running MarkLogic 8.0 with horchata enabled on Atari 2600 under a Montgomery Ward UrgeForest office desk.',
            'body': 'Tonx pour-over, readymade Pitchfork slow-carb Portland brunch Schlitz gastropub artisan. Trust fund Echo Park wayfarers Godard ethnic leggings kale chips Shoreditch Bushwick, post-ironic forage blog beard meh. Fap narwhal farm-to-table, wolf XOXO seitan four loko. Dreamcatcher banh mi try-hard Tumblr literally. Swag literally Kickstarter selfies.',
            'owner': {
              'userName': 'successUser@marklogic.com',
              'displayName': 'Pat',
              'id': 'cf99542d-f024-4478-a6dc-7e723a51b040',
              'reputation': 7
            },
            'tags': ['birds', 'flying-creatures', 'vultures', 'love', 'semantics'],
            'creationDate': '2013-04-11T18:37:14.773514-07:00',
            'answers': [],
            'comments': [],
            'id': '/qna/3.json'
          },
          {
            'title': 'Why do birds suddenly appear every time you are near? I\'m running MarkLogic 7.0 with geospatial and semantics enabled on Fedora 99 under an IKEA Borgsjo office desk.',
            'body': 'Tonx pour-over, readymade Pitchfork slow-carb Portland brunch Schlitz gastropub artisan. Trust fund Echo Park wayfarers Godard ethnic leggings kale chips Shoreditch Bushwick, post-ironic forage blog beard meh. Fap narwhal farm-to-table, wolf XOXO seitan four loko. Dreamcatcher banh mi try-hard Tumblr literally. Swag literally Kickstarter selfies.',
            'owner': {
              'userName': 'joeUser@marklogic.com',
              'displayName': 'Joe',
              'id': 'cf99542d-f024-4478-a6dc-7e723a51b040',
              'reputation': 999
            },
            'tags': ['birds', 'robins', 'vultures'],
            'creationDate': '2014-06-09T15:37:14.773514-07:00',
            'answers': [],
            'comments': [],
            'id': '/qna/1.json'
          },
          {
            'title': 'Why do avians suddenly appear every time you are near? I\'m running MarkLogic 6.0 with beverages enabled on Ubuntu 60 under a Macy\'s Doss office desk.',
            'body': 'Tonx pour-over, readymade Pitchfork slow-carb Portland brunch Schlitz gastropub artisan. Trust fund Echo Park wayfarers Godard ethnic leggings kale chips Shoreditch Bushwick, post-ironic forage blog beard meh. Fap narwhal farm-to-table, wolf XOXO seitan four loko. Dreamcatcher banh mi try-hard Tumblr literally. Swag literally Kickstarter selfies.',
            'owner': {
              'userName': 'maryUser@marklogic.com',
              'displayName': 'Mary',
              'id': 'cf99542d-f024-4478-a6dc-7e723a51b040',
              'reputation': 123
            },
            'tags': ['birds', 'robins'],
            'creationDate': '2014-05-23T15:37:14.773514-07:00',
            'answers': [],
            'comments': [],
            'id': '/qna/2.json'
          },
          {
            'title': 'Why do flying creatures suddenly appear every time you are near? I\'m running MarkLogic 8.0 with horchata enabled on Atari 2600 under a Montgomery Ward UrgeForest office desk.',
            'body': 'Tonx pour-over, readymade Pitchfork slow-carb Portland brunch Schlitz gastropub artisan. Trust fund Echo Park wayfarers Godard ethnic leggings kale chips Shoreditch Bushwick, post-ironic forage blog beard meh. Fap narwhal farm-to-table, wolf XOXO seitan four loko. Dreamcatcher banh mi try-hard Tumblr literally. Swag literally Kickstarter selfies.',
            'owner': {
              'userName': 'successUser@marklogic.com',
              'displayName': 'Pat',
              'id': 'cf99542d-f024-4478-a6dc-7e723a51b040',
              'reputation': 7
            },
            'tags': ['birds', 'flying-creatures', 'vultures', 'love', 'semantics'],
            'creationDate': '2013-04-11T18:37:14.773514-07:00',
            'answers': [],
            'comments': [],
            'id': '/qna/3.json'
          }
        ],
        'facets': {
          'tags': [
            {
              'name': 'robin',
              'count': 4
            },
            {
              'name': 'birds',
              'count': 6
            },
            {
              'name': 'vulture',
              'count': 4
            },
            {
              'name': 'sparrow',
              'count': 2
            },
            {
              'name': 'hen',
              'count': 1
            },
            {
              'name': 'quadcopter',
              'count': 1
            },
            {
              'name': 'eagle',
              'count': 3
            },
            {
              'name': 'alala',
              'count': 4
            },
            {
              'name': 'cormorant',
              'count': 2
            },
            {
              'name': 'dodo',
              'count': 1
            },
            {
              'name': 'cockatoo',
              'count': 4
            },
            {
              'name': 'hawk',
              'count': 3
            },
            {
              'name': 'goose',
              'count': 1
            }
          ]
        }
      };
      /*jshint ignore:end */

      // All tags begin as unselected
      $scope.unselTags = angular.copy($scope.searchResultsStatic.facets.tags);
      $scope.selTags = [];

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
          }
        );

      };

    }

  ]);

});
