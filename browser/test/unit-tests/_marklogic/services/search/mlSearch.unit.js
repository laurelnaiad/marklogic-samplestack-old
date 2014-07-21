define(['testHelper', 'mocks/index'], function (helper, mocks) {

  return function () {
    describe('mlSearch', function () {
      var $q;
      var $httpBackend;
      var mlSearch;
      var MlSearchSpecModel;
      var MlSearchResultsModel;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (
            _$httpBackend_,
            _$q_,
            _mlSearch_,
            _MlSearchSpecModel_,
            _MlSearchResultsModel_
          ) {
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            mlSearch = _mlSearch_;
            MlSearchSpecModel = _MlSearchSpecModel_;
            MlSearchResultsModel = _MlSearchResultsModel_;
            done();
          }
        );
      });

      it('should execute', function (done) {
        var spec = new MlSearchSpecModel({
          queryText: 'test'
        });
        helper.setExpectCsrf($httpBackend);
        $httpBackend.expectPOST('/v1/search').respond(200, mocks.searchResult);

        var results = mlSearch.searchOne(spec);
        results.$mlWaiting.then(
          function () {
            results.value.should.be.ok;
            done();
          },
          function (reason) { assert(JSON.stringify(reason)); done(); }
        );
        $httpBackend.flush();
      });

    });
  };

});
