define([
  'app/module'
], function (module) {
  module.directive('ssMarkdownEditor', [function () {
    return {
      restrict: 'A',
      // replace: true,
      // higchart is embedded, this is subject to change as to how to get
      // the chart loaded. Much of the work here will be in driving highchart
      // bindings from data
      templateUrl: '/app/directives/ssMarkdownEditor.html',
      scope: {
        content: '=content'
      },
      compile: function compile (tElement, tAttrs, transclude) {
        return {
          pre: function (scope, element, attrs) {


          },
          post: function (scope, element, attrs) {

          }
        };
      }
    };
  }]);
});
