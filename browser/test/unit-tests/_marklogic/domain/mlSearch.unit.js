define([
  'testHelper',
  'json!mocks/searchResult1.json'
], function (helper, searchResult) {

  return function () {
    describe('mlSearch', function () {
      var $httpBackend;
      var mlSearch;

      beforeEach(function (done) {
        angular.mock.module('_marklogic');
        inject(
          function (_$httpBackend_, _mlSearch_) {
            $httpBackend = _$httpBackend_;
            mlSearch = _mlSearch_;
            done();
          }
        );
      });

      it('should be valid for a simple a text query', function () {
        var s = mlSearch.create({
          criteria: { query: { qtext: 'testy' } }
        });
        s.$ml.valid.should.be.true;
      });

      it('should POST as expected', function (done) {
        helper.setExpectCsrf($httpBackend);
        $httpBackend.expectPOST(/\/v1\/search$/).respond(200, searchResult );

        var s = mlSearch.post({
          criteria: { query: { qtext: 'testy' } }
        });
        s.$ml.waiting.then(
          function () {
            s.results.should.be.ok;
            s.$ml.valid.should.be.true;
            done();
          },
          function (reason) { assert(false, JSON.stringify(reason)); done(); }
        );

        $httpBackend.flush();
      });

      it('should throw for unsupported methods', function () {
        try {
          var s = mlSearch.getOne({
            id: 1
          });
        }
        catch (err) {
          assert(true);
          return;
        }
        assert(false, 'expected error');
      });
    });

  };

});
