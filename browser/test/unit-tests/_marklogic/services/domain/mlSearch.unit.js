define([
  'testHelper',
  'json!mocks/searchResult1.json'
], function (helper, searchResult) {

  return function () {
    describe('mlSearch', function () {
      var $httpBackend;
      var mlSearch;
      var mlHttp;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (_$httpBackend_, _mlHttp_, _mlSearch_) {
            $httpBackend = _$httpBackend_;
            mlHttp = _mlHttp_;
            mlHttp.setBaseUrl('/v1');
            mlSearch = _mlSearch_;
            done();
          }
        );
      });

      it('should be valid for a simple a text query', function () {
        var s = mlSearch.create({
          spec: { query: { qtext: 'testy' } }
        });
        s.$ml.valid.should.be.true;
      });

      it('should POST as expected', function (done) {
        helper.setExpectCsrf($httpBackend);
        $httpBackend.expectPOST(/\/v1\/search$/).respond(200, searchResult );

        var s = mlSearch.create({
          spec: { query: { qtext: 'testy' } }
        });
        s = mlSearch.post(s);
        s.$ml.waiting.then(
          function () {
            s.instance.results.should.be.ok;
            s.$ml.valid.should.be.true;
            done();
          },
          function (reason) { assert(false, JSON.stringify(reason)); done(); }
        );

        $httpBackend.flush();
      });
    });

  };

});
