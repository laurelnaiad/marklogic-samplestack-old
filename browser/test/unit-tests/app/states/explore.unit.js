define(['testHelper'], function (helper) {

  return function () {
    describe('explore', function () {
      var $injector;
      var $rootScope;
      var $controller;
      var $httpBackend;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (
            _$injector_,
            _$rootScope_,
            _$controller_,
            _$httpBackend_
          ) {
            $injector = _$injector_;
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            done();
          }
        );
      });


      describe('exploreCtlr', function () {
        var exploreCtlr;
        it('should set page title', function () {
          var scope = $rootScope.$new();
          scope.setPageTitle = sinon.spy();
          exploreCtlr = $controller('exploreCtlr', { $scope: scope });
          scope.setPageTitle.should.have.been.calledWith('explore');
        });
      });

    });
  };
});
