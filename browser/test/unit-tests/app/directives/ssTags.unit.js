define(['testHelper'], function (helper) {

  return function () {
    describe('ssTags', function () {
      var scope;
      var $compile;
      var element;
      // var testable;
      // var stub;
      // var getDocsResponse = 'hello';
      // var $timeout;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function ($rootScope, _$compile_, ssModel) {

            scope = $rootScope.$new();
            $compile = _$compile_;

            element = angular.element('<ss-tags tags="tags"></ss-tags>');

            scope.tags = ssModel.tag.find();
            done();
          }
        );
      });

      xit('should have elements consistent with bound var', function () {
        $compile(element)(scope);
        scope.$digest();
        element.find('li').length.should.equal(scope.tags.length);
      });

    });
  };
});
