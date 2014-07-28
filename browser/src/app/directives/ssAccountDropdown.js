define([
  'app/module'
], function (module) {
  module.directive('ssAccountDropdown', function () {
    return {
      restrict: 'A',
      templateUrl: '/app/directives/ssAccountDropdown.html',
      link: function (scope, element, attrs) {
        scope.logout = function () {
          scope.$emit('logout');
        };
      }
    };
  });
});
