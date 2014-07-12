define(['testHelper'], function (helper) {

  return function () {
    describe('mlSchama', function () {
      var testable;
      var storeCtlr;
      var stub;
      // var getDocsResponse = 'hello';
      var $timeout;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (mlSchema) {
            testable = mlSchema;
            done();
          }
        );
      });

      it('should have a validator', function () {
        // $timeout.flush();
        testable.validator.should.be.ok;
      });

    });
  };

});
