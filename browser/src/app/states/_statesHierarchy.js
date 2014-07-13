define(
  [
    'app/module',
  ],
  function (module) {
    var root = {
      name: 'root',
      abstract: true,
      url: '',
      views: {
        '': {
          // template doesn't follow naming conventions
          controller: 'rootCtlr',
          templateUrl: '/app/states/_root.html'
        },
        // shadow scope where our data store lives
        // fullName will be store@root, but we should need it.
        // this scope isolates data activity from the UI.
        //
        // shadowdom will obviate the usefulness of this in the future
        'store@root': {
          controller: 'storeCtlr',
          templateUrl: null
        }

      },
      children: [
        {
          name: 'layout',
          abstract: true,
          controller: 'layoutCtlr',
          templateUrl: '/app/states/_layout.html'
        }
      ]
    };

    root.children[0].children = [
      {
        name: 'fourOhFour',
        url: '/404',
        controller: 'fourOhFourCtlr',
        templateUrl: '/app/states/fourOhFour.html'
      },
      {
        name: 'search',
        // will deal with all sorts of parameters here, potentially
        // as sub-states
        url: '/',
        controller: 'searchCtlr',
        templateUrl: '/app/states/search.html'
      },
      {
        name: 'qnaDoc',
        url: '/doc/:id',
        controller: 'qnaDocCtlr',
        templateUrl: '/app/states/qnaDoc.html'
      },
      {
        name: 'ask',
        url: '/ask',
        controller: 'askCtlr',
        templateUrl: '/app/states/ask.html'
      }
    ];

    module.constant('statesHierarchy', root);

  }
);
