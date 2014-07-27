define(['testHelper'], function (helper) {

  return function () {
    describe('ssSession', function () {
      var ssSession;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (_ssSession_) {
            ssSession = _ssSession_;
            done();
          }
        );
      });

      var validCreds = {
        username: 'blahblah',
        password: 'password'
      };

      var validUser = {
        'websiteUrl':'http://website.com/grechaw',
        'reputation':0,
        'displayName':'joeUser',
        'aboutMe':'Some text about a basic user',
        'id':'cf99542d-f024-4478-a6dc-7e723a51b040',
        'location':null,
        'username':'joeUser@marklogic.com',
        'votes':[],
        'role':[
          'SAMPLESTACK_CONTRIBUTOR'
        ]
      };

      it('should validate a valid instance pre-login', function () {
        var session = ssSession.create(validCreds);
        session.$ml.valid.should.be.true;
      });

      it('should validate a valid instance post-login', function () {
        var session = ssSession.create(validUser);
        session.$ml.valid.should.be.true;
      });

      it('should recognize one bad combo', function () {
        var session = ssSession.create(
          _.merge(validCreds, { id: validUser.id }));
        session.$ml.valid.should.be.false;
      });

      it('should recognize another bad combo', function () {
        delete validUser.role;
        var session = ssSession.create(validUser);
        session.$ml.valid.should.be.false;
      });
    });
  };

});
