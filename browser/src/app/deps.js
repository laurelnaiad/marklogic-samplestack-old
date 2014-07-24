/*
app/deps.js

Load all dependency modules files  and return an array of their angular module
names.
 */

require.config({
  paths: {
    'deps': '/deps',

    'lodash': 'deps/lodash/dist/lodash.compat<%=min%>',
    'angular': 'deps/angular/angular<%=min%>',
    'ui-router': 'deps/angular-ui-router/release/angular-ui-router<%=min%>',
    'state-helper': 'deps/angular-ui-router.stateHelper/statehelper<%=min%>',
    'ui-bootstrap': 'deps/angular-bootstrap/ui-bootstrap-tpls<%=min%>',
    'sanitize-ng': 'deps/angular-sanitize/angular-sanitize<%=min%>',
    'markdown-ng': 'deps/ngMarkdown/wizMarkdown/wizMarkdown<%=min%>',
    'marked': 'deps/marked/lib/marked<%=min%>',
    'angular-marked': 'deps/angular-marked/angular-marked<%=min%>',
    'jquery': 'deps/jquery/dist/jquery<%=min%>',
    'highcharts': 'deps/highcharts/highcharts',
    'highcharts-ng': 'deps/highcharts-ng/dist/highcharts-ng<%=min%>'
  },

  shim: {
    'angular': { exports: 'angular', deps: ['jquery'] },
    'angular-mocks': { deps: ['angular'] },
    'ui-router': { deps: ['angular'] },
    'state-helper': { deps: ['angular', 'ui-router'] },
    'ui-bootstrap': { deps: ['angular'] },
    'highcharts-ng': { deps: ['angular', 'highcharts'] },
    'highcharts': { deps: ['jquery'] },
    'markdown-ng': { deps: ['angular', 'sanitize-ng'] },
    'angular-marked': { deps: ['angular', 'marked'] },
  }
});

define(
  [
    // first include those that we actually need to "handle" while we load
    // them here.  List them first so that only those that need special
    // handling need to be referenced in the callback function.
    'lodash',
    'angular',

    'ui-router',
    'state-helper',
    'ui-bootstrap',
    'highcharts-ng',
    'angular-marked',
    'markdown-ng',

    '_marklogic/marklogic'
  ],
  function (lodash, angular) {

    // lodash and angular are made global as a convenience.
    window._ = lodash;
    window.angular = angular;

    return [
      'ui.router',
      'ui.router.stateHelper',
      'ui.bootstrap',
      'highcharts-ng',
      'hc.marked',
      'markdown-ng',

      'marklogic.sample'
    ];
  }
);
