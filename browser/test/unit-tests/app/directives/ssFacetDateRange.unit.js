define(['testHelper'], function (helper) {

  return function () {
    describe('ssFacetDateRange', function () {
      // this is the imaginary view scope for our tests
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
              '<ss-facet-date-range data="dateRangeObj"></div>'
            );

            done();
          }
        );
      });

      it('should work', function () {
        $compile(element)(scope);
        scope.dateRangeObj = {
          my: 'mock data',
          goes: {
            here: 'and'
          },
          also: {
            'goes': {
              here: '!'
            }
          }
        };
        scope.$digest();
        element.css('background-color').should.equal('white');
        scope.dateRangeObj.goes.here = 'this should change background';
        scope.$digest();
        element.css('background-color').should.equal('yellow');
      });

    });

  };
});
