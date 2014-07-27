define(['testHelper'], function (helper) {

  return function () {
    describe('mlHttp', function () {
      var mlHttp;
      var $q;
      var $http;
      var $httpBackend;
      var mlModel;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (_mlHttp_, _$http_, _$httpBackend_, _$q_, _mlModel_) {
            mlHttp = _mlHttp_;
            mlHttp.setBaseUrl('/v1');
            $q = _$q_;
            $http = _$http_;
            $httpBackend = _$httpBackend_;
            mlModel = _mlModel_;
            done();
          }
        );
      });

      var makeX = function (spec) {
        var mySpec = _.merge(
          {
            schema: {
              id: 'http://example.com#x',
              properties: {
                id: { type: 'string' }
              }
            }
          },
          spec
        );

        var svc = mlModel.extend(mySpec);

        return svc;
      };

      it('should support get', function (done) {
        var x = makeX();
        $httpBackend.expectGET(/\/v1\/x\/1/).respond({ id: 1 });

        var obj = x.getOne(1);

        obj.$ml.waiting.then(
          function () {
            obj.instance.id.should.equal(1);
            done();
          },
          function (reason) { assert(JSON.stringify(reason)); done(); }
        );
        $httpBackend.flush();

      });

    });

  };

});
