/*
marklogic/deps.js

Load all dependency modules files  and return an array of their angular module
names.

TODO: consider possibility of autogenerting here.

TODO: figure out whether things like angular should be manually
referenced where used.

 */

require.config({
  paths: {
    deps: '/deps',

    'angular': 'deps/angular/angular<%=min%>',
    'angular-cookies': 'deps/angular-cookies/angular-cookies<%=min%>',
    'moment': 'deps/momentjs/moment<%=min%>'
  },

  shim: {
    'angular': {
      exports: 'angular'
    },
    'angular-cookies': {
      deps: ['angular']
    }
  }
});

define(
  [
    'angular',
    'angular-cookies'
  ],
  function (angular) {

    // angular is made global as a convenience.
    window.angular = angular;

    // we won't introduce any angular dependencies -- otherwisethis would be
    // an array
    return ['ngCookies'];
  }
);
