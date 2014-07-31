define(['testHelper'], function (helper) {

  return function () {
    describe('SsContributorModel', function () {
      var SsContributorModel;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (_SsContributorModel_) {
            SsContributorModel = _SsContributorModel_;
            done();
          }
        );
      });

      var validContributor  = {
        'websiteUrl':'http://website.com/grechaw',
        'reputation':0,
        'displayName':'joeUser',
        'aboutMe':'Some text about a basic user',
        'id':'cf99542d-f024-4478-a6dc-7e723a51b040',
        'location':null,
        'userName':'joeUser@marklogic.com',
        'votes':[],
        'role':[
          'SAMPLESTACK_CONTRIBUTOR'
        ]
      };

      it('should validate a valid instance', function () {
        var contributor = new SsContributorModel(validContributor);
        contributor.$mlValid.should.be.true;
      });

      it('should detect an invalid instance', function () {
        var invalid = _.clone(validContributor);
        invalid.userName = null;
        var contributor = new SsContributorModel(invalid);
        contributor.$mlValid.should.be.false;
      });

      describe('as an override of MlUserModel', function () {
        it('should work with mlAuth', function (done) {
          var $q;
          var $httpBackend;
          var mlAuth;
          var SsCredentialsModel;
          inject(
            function (
              _$httpBackend_,
              _mlAuth_,
              _SsCredentialsModel_
            ) {
              $httpBackend = _$httpBackend_;
              mlAuth = _mlAuth_;
              SsCredentialsModel = _SsCredentialsModel_;

              var credsTemplate = {
                username: 'joseph',
                password: 'josephPass'
              };
              var creds = new SsCredentialsModel(credsTemplate);

              helper.setExpectCsrf($httpBackend);
              $httpBackend.expectPOST(credsTemplate).respond(validContributor);
              mlAuth.authenticate(creds).then(
                function (contributor) {
                  // got the data back
                  contributor.value.should.deepEqual(validContributor);
                  // have a valid MlUserModel instance
                  contributor.$mlIsValid.should.be.true;
                },
                function (reason) { assert(false, JSON.stringify(reason)); }
              );

              done();
            }
          );

        });

      });

    });
  };

});
