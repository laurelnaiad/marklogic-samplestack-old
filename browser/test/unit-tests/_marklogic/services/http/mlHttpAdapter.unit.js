define(['testHelper'], function (helper) {

  return function () {
    describe('mlHttpAdapter', function () {
      var sut;

      var $http;
      var $httpBackend;
      // var storeCtlr;
      // var stub;
      // // var getDocsResponse = 'hello';
      // var $timeout;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (_$http_, _$httpBackend_) {
            $http = _$http_;
            $httpBackend = _$httpBackend_;
            done();
          }
        );
      });

      describe('http interceptor', function () {

        it('it should override POST to login as form-encoded', function () {

          var uname = 'me@somewhere.com';
          var pass = 'myPass';

          $httpBackend.expectPOST(
            '/v1/login',
            function (body) {
              return body ===
                  'username=' + encodeURI(uname) + '&' +
                  'password=' + encodeURI(pass);
            },
            function (headers) {
              return headers['Content-Type'] ===
                  'application/x-www-form-urlencoded';
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

    });
  };

});
