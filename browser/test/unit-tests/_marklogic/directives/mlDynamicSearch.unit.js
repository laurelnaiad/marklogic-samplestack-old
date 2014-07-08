define(['testHelper'], function (helper) {

  return function () {
    describe('mlDynamicSearch', function () {
      var scope;
      var $compile;
      var element;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function ($rootScope, _$compile_) {

            scope = $rootScope;
            $compile = _$compile_;

            element = angular.element(
              '<div ml-dynamic-search="dsObj">' +
              '<div ml-ds-bind="example1" ml-ds-value="exampleVal"></div>' +
              '<div ml-ds-bind="example2" ml-ds-value="exampleBack"></div>' +
              '</div>'
            );

            done();
          }
        );
      });

      it('should have two-way binding for properties', function () {
        $compile(element)(scope);
        scope.exampleVal = 'testy';
        scope.dsObj = {
          example2: 'test back'
        };
        scope.$digest();
        scope.dsObj.example1.should.equal('testy');
        scope.exampleBack.should.equal('test back');
      });

    });

  };
});
