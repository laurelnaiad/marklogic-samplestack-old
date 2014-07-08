define(['testHelper'], function (helper) {

  return function () {
    describe('store', function () {
      var testable;
      var stub;
      // var getDocsResponse = 'hello';
      var $timeout;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function ($injector, $q, _$timeout_) {
            // stub = helper.stubPromise($q, docs, 'getDocs', getDocsResponse);
            testable = helper.getTestableController(
              $injector,
              'storeCtlr'
            );
            $timeout = _$timeout_;
            done();
          }
        );
      });

      // it('should should say hey', function () {
      //   // $timeout.flush();
      //   testable.$scope.hey.should.equal('yo');
      // });

    });
  };
});
