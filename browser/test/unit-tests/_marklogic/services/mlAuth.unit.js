define(['testHelper'], function (helper) {

  return function () {

    describe('mlAuth', function () {
      var $q;
      var $httpBackend;
      var mlAuth;
      var MlUserModel;
      var MlCredentialsModel;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (
            _$httpBackend_,
            _$q_,
            _mlAuth_,
            _MlUserModel_,
            _MlCredentialsModel_
          ) {
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            MlUserModel = _MlUserModel_;
            mlAuth = _mlAuth_;
            MlCredentialsModel = _MlCredentialsModel_;
            done();
          }
        );
      });

      it('should authenticate', function () {
        var credsTemplate = {
          username: 'joseph',
          password: 'josephPass'
        };
        var creds = new MlCredentialsModel(credsTemplate);

        var userTemplate = {
          username: 'joseph',
          aboutMe: 'I\'m a test.'
        };

        helper.setExpectCsrf($httpBackend);
        $httpBackend.expectPOST(credsTemplate).respond(userTemplate);
        mlAuth.authenticate(creds).then(
          function (user) {
            // got the data back
            user.value.should.deepEqual(userTemplate);
            // have a valid MlUserModel instance
            user.$mlIsValid.should.be.false;
          },
          function (reason) { assert(false, JSON.stringify(reason)); }
        );
      });

    });
  };

});
