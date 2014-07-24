define(['app/module'], function (module) {
  module.directive('ssAskEditPreview', ['marked', function (marked) {
    return {
      restrict: 'A',
      // replace: true,
      // higchart is embedded, this is subject to change as to how to get
      // the chart loaded. Much of the work here will be in driving highchart
      // bindings from data
      templateUrl: '/app/directives/ssAskEditPreview.html',
      scope: '=',
      compile: function compile (tElement, tAttrs, transclude) {
        marked.setOptions({
          gfm: true,
          highlight: function (code) {
            return hljs.highlightAuto(code).value;
          }
        });
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
