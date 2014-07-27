define(['testHelper'], function (helper) {

  return function () {

    describe('moment', function () {
      var $filter;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (
            _$filter_
          ) {
            $filter = _$filter_;
            done();
          }
        );
      });

      describe('toDateFilter', function () {
        it('should take a string and make a date', function () {
          var date = $filter('toDate')('2014-04-25T01:32:21.196Z');
          date.should.be.an.instanceOf(Date);
        });

        it('should return undefined if passed nothing', function () {
          var date = $filter('toDate')(0);
          expect(date).to.be.undefined;
        });

      });

      describe('fromDateFilter', function () {
        it('should take a date and make a string', function () {
          var date = new Date('2004-03-12');
          var str = $filter('fromDate')(date);
          str.should.be.a('string');
        });

        it('should return undefined if passed nothing', function () {
          var str = $filter('fromDate')(0);
          expect(str).to.be.undefined;
        });

      });

    });
  };

});
