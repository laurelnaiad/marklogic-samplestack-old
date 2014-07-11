define(
  [
    'app/module',
  ],
  function (module) {
    var root = {
      name: 'root',
      abstract: true,
      url: '',
      children: [],
      views: {
        '': {
          // template doesn't follow naming conventions
          templateUrl: '/app/states/_root.html'
        },
        // shadow scope where our data store lives
        // fullName will be store@root, but we should need it.
        // this scope isolates data activity from the UI.
        //
        // shadowdom will obviate the usefulness of this in the future
        'store@root': {
          templateUrl: null
        }

      }
    };

    var layout = {
      name: 'layout',
      abstract: true,
          // template doesn't follow naming conventions
      templateUrl: '/app/states/_layout.html'
    };
    root.children.push(layout);

    layout.children = [
      // {
      //   name: 'documents',
      //   url: '/' // there will be a bunch of URL parameters possible
      // },
      {
        name: 'fourOhFour',
        url: '/404',
      },
      {
        name: 'explore',
        // will deal with all sorts of parameters here, potentially
        // as sub-states
        url: '/'
      },
      {
        name: 'qnaDoc',
        url: '/doc/:id'
      },
      {
        name: 'ask',
        url: '/ask'
      }
    ];

    module.constant('statesHierarchy', root);

  }
);
