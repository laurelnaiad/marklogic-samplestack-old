define([
  'testHelper',
  'mocks/index'
], function (helper, mocks) {

  return function () {
    describe('explore', function () {
      // var $injector;
      var $rootScope;
      var $controller;
      var $httpBackend;
      var $q;
      var $timeout;
      var appRouting;

      var mlSearch;
      var allTagsDialog;
      var scope;
      var updateQueryParamsStub;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (
            _$controller_,
            _$httpBackend_,
            _$timeout_,
            _$rootScope_,
            _appRouting_,
            _mlSearch_,
            _allTagsDialog_
          ) {
            // $injector = _$injector_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $timeout = _$timeout_;
            $rootScope = _$rootScope_;
            mlSearch = _mlSearch_;
            appRouting = _appRouting_;
            allTagsDialog = _allTagsDialog_;

            scope = $rootScope.$new();
            scope.setPageTitle = sinon.spy();

            done();
          }
        );
      });

      describe('exploreCtlr', function () {
        var exploreCtlr;
        it('should set page title', function () {
          exploreCtlr = $controller('exploreCtlr', { $scope: scope });
          scope.setPageTitle.should.have.been.calledWith('explore');
        });

        it('should search', function (done) {
          appRouting.params = {};
          scope.initializing = false;

          exploreCtlr = $controller('exploreCtlr', { $scope: scope });

          $httpBackend.expectGET('/app/states/_root.html')
              .respond(200);
          $httpBackend.expectGET('/app/states/_layout.html')
              .respond(200);
          $httpBackend.expectGET('/app/states/explore.html')
              .respond(200);
          $httpBackend.expectPOST('/v1/search').respond(mocks.searchResult);
          scope.$apply();
          $httpBackend.flush();
          $timeout.flush();

          var expectedResults = angular.copy(mocks.searchResult);
          expectedResults.items = expectedResults.results;
          delete expectedResults.results;
          angular.forEach(expectedResults.items, function (item) {
            if (item.content.body && item.content.body.length > 400) {
              item.content.body = item.content.body.substring(0,400) +
                  '...';
            }
          });
          scope.search.results.should.deep.equal(expectedResults);
          done();
        });
      });

    });
  };
});
