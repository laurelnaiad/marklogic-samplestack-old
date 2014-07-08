define(['testHelper'], function (helper) {

  return function () {
    describe('ssModel', function () {
      var testable;
      var stub;
      // var getDocsResponse = 'hello';
      var $timeout;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (ssModel) {
            testable = ssModel;
            done();
          }
        );
      });

      it('should have some stuff', function () {
        var tags = testable.tag.find();
        tags.should.exist;
      });

    });
  };
});
