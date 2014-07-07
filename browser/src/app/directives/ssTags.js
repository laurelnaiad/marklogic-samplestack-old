define(['app/module'], function (module) {
  module.directive('ssTags', function () {
    return {
      restrict: 'EAC',
      scope: {
        tags: '='
      },
    /* jshint -W101 */ // disable line length rule
      template:
          '<ul><li ng-repeat="tag in tags">' +
          '<input type="checkbox" />' +
          '{{tag.name}} ({{tag.count}})' +
          '</li></ul>',
      link: function (scope, element, attrs, ctlr) {
      }
    };
  });
});
