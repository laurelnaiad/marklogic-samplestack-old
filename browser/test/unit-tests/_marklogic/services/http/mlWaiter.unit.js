define(['testHelper'], function (testHelper) {

  return function () {

    var stubDefer = testHelper.stubPromiseDeferred;
    var stubObj = {
      dummy: function () {}
    };

    describe('mlWaiter', function () {

      var sut;
      var $q;
      var scope;
      var $timeout;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function ($injector, $rootScope, _$timeout_, _$q_, mlWaiter) {
            $q = _$q_;
            $timeout = _$timeout_;
            sut = mlWaiter;
            scope = $rootScope.$new();
            scope.model = {};
            done();
          }
        );
      });

      it('should take a promise and resolve it', function (done) {
        var h = {};
        var stub = stubDefer($q, stubObj, 'dummy', h);
        sut.waitFor(stubObj.dummy(), scope.model);
        scope.model.$mlWaiting.should.eq.true;
        scope.model
            .should.not.have.property('$mlError');
        h.deferred.resolve(1);
        $timeout.flush();
        scope.model
            .should.not.have.property('$mlError');
        scope.model
            .should.not.have.property('$mlWaiting');
        scope.model.should.have.property('value', 1);
        done();
      });
    });
  };

});
