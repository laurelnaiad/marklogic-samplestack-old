define(['app/module'], function (module) {
  module.directive('ssTags', function () {
    return {
      restrict: 'EA',
      scope: {
        tags: '='
      },
    /* jshint -W101 */ // disable line length rule
      template:
          '<ul class="ss-tags"><li ng-repeat="tag in tags">' +
          '<input type="checkbox" />' +
          '{{tag.name}} ({{tag.count}})' +
          '</li></ul>',
      link: function (scope, element, attrs, ctlr) {
      }
    };
  });
});
