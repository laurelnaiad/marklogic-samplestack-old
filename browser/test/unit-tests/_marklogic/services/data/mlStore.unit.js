define(['testHelper'], function (helper) {

  return function () {
    describe('mlStore', function () {
      var testable;
      var storeCtlr;
      var stub;
      // var getDocsResponse = 'hello';
      var $timeout;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (mlStore) {
            testable = mlStore;
            done();
          }
        );
      });

      describe('with scope set', function () {
        beforeEach(function (done) {
          inject(
            function ($injector) {
              storeCtlr = helper.getTestableController(
                $injector,
                'storeCtlr'
              );
              done();
            }
          );
        });

        it('should have access to scope', function () {
          // $timeout.flush();
          testable.scope.should.be.ok;
        });

      });

    });
  };

});
