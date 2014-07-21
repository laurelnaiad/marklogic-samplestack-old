define(['testHelper'], function (helper) {

  return function () {
    describe('mlHttpAdapter', function () {
      var mlHttpAdapter;
      var $q;
      var $http;
      var $httpBackend;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (_mlHttpAdapter_, _$http_, _$httpBackend_, _$q_) {
            mlHttpAdapter = _mlHttpAdapter_;
            $q = _$q_;
            $http = _$http_;
            $httpBackend = _$httpBackend_;
            done();
          }
        );
      });

      var setExpectCsrf = function (token) {
        $httpBackend.expectGET(
          '/v1/session'
        ).respond(200, null, { 'X-CSRF-TOKEN': token });
      };

      describe('mlHttpInterceptor ', function () {

        it('should set CSRF prior to POSTing', function (done) {
          setExpectCsrf('some token');
          $httpBackend.expectPOST('/v1/anything').respond(200);
          var resp = $http.post('/v1/anything');
          resp.then(
            function () {
              $http.defaults.headers.common['X-CSRF-TOKEN']
                  .should.equal('some token');
              done();
            },
            function (reason) { assert(JSON.stringify(reason)); done(); }
          );
          $httpBackend.flush();
        });

        it('should supply CSRF when POSTing', function () {
          setExpectCsrf('some token');
          $httpBackend.expectPOST(
            '/v1/something',
            null,
            function (headers) {
              var hasCsrf = headers['X-CSRF-TOKEN'] === 'some token';
              return hasCsrf;
            }
          ).respond(200);

          var resp = $http.post('/v1/something');
          $httpBackend.flush();
          resp.should.eventually.have.property('status', 200);
        });

        it('should only make one request to get CSRF', function (done) {
          setExpectCsrf('some token');
          $httpBackend.expectPOST('/v1/first').respond(200);
          $httpBackend.expectPUT('/v1/second').respond(200);
          $q.all([
            $http.post('/v1/first'),
            $http.put('/v1/second')
          ]).then(
            function (responses) {
              responses[0].status.should.equal(200);
              responses[1].status.should.equal(200);
              done();
            },
            function (reason) { assert(JSON.stringify(reason)); done(); }
          );
          $httpBackend.flush();
        });
      });

      it('should support PATCH', function () {
        setExpectCsrf('some token');
        $httpBackend.expectPATCH('/v1/something').respond(200);
        var resp = $http.patch('/v1/something');
        $httpBackend.flush();
        resp.should.eventually.have.property('status', 200);
      });

        it('should form-encode login', function () {
          var uname = 'me@somewhere.com';
          var pass = 'myPass';

          setExpectCsrf('some token');
          $httpBackend.expectPOST(
            '/v1/login',
            function (body) {
              return body ===
                  'username=' + encodeURI(uname) + '&' +
                  'password=' + encodeURI(pass);
            },
            function (headers) {
              var encoded = headers['Content-Type'] ===
                  'application/x-www-form-urlencoded';
              return encoded;
            }
          ).respond(200);

          var resp = $http.post(
            '/v1/login',
            { username: uname, password: pass}
          );
          $httpBackend.flush();
          resp.should.eventually.have.property('status', 200);
        });
      });

      it('should know what it can\'t do', function () {
        var inst = {}; // no operations defined
        expect(mlHttpAdapter.post.bind(null, inst)).to.throw(
          'operation not supported: POST'
        );
      });

      it('should be able to do a POST', function (done) {
        var inst = {
          operations: {
            'POST': {
              endpoint: '/stuff'
            }
          }
        };

        var result = mlHttpAdapter.post(inst, { a: 'b' });
        setExpectCsrf('some token');
        $httpBackend.expectPOST(
          '/v1/stuff',
          { a: 'b' }
        ).respond(200, { a: 'b' });
        result.$mlWaiting.then(
          function () {
            inst.value.a.should.equal('b');
            done();
          },
          function (reason) { assert(JSON.stringify(reason)); done(); }
        );
        $httpBackend.flush();
      });

      it('should be able to do a GET', function (done) {
        var inst = {
          operations: {
            'GET': {
              endpoint: '/stuff',
              params: {
                id: 'id'
              },
              style: 'query' //as opposed to 'path'
            }
          },
          value: {
            id: 1
          }
        };

        var result = mlHttpAdapter.get(inst);
        $httpBackend.expectGET('/v1/stuff?id=1')
            .respond(200, { id: 1, a: 'b' });
        result.$mlWaiting.then(
          function () {
            inst.value.a.should.equal('b');
            done();
          },
          function (reason) { assert(JSON.stringify(reason)); done(); }
        );
        $httpBackend.flush();
      });
    });
  };

});
