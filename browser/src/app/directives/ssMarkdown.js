define([
  'app/module',
  'marked',
  'highlightjs'
], function (module, marked, hljs) {
  window.marked = marked;
  marked.setOptions({
    gfm: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });


  /**
   * @ngdoc directive
   * @name ssMarkdown
   * @restrict A
   * @element ANY
   *
   * @description
   * TBD
   */
  module.directive('ssMarkdown', [function () {
    return {
      restrict: 'A',
      scope: {
        content: '=content'
      },
      compile: function compile (tElement, tAttrs, transclude) {
        tElement.append('<div marked="content"></div>');
        return function () {

        };
      }
    };
  }]);
});
