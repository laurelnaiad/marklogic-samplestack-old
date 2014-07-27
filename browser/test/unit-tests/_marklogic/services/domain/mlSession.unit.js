define(['testHelper'], function (helper) {

  return function () {
    describe('mlSession', function () {
      var $httpBackend;
      var mlSession;
      var mlHttp;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (_$httpBackend_, _mlHttp_, _mlSession_) {
            $httpBackend = _$httpBackend_;
            mlHttp = _mlHttp_;
            mlHttp.setBaseUrl('/v1');
            mlSession = _mlSession_;
            done();
          }
        );
      });

      it('should be valid with username and password', function () {
        var s = mlSession.create({
          username: 'username',
          password: 'password'
        });
        s.$ml.valid.should.be.true;
      });

      it('should not be valid with id and stuff', function () {
        var s = mlSession.create({
          id: 'me',
          stuff: 'extra'
        });
        s.$ml.valid.should.be.false;
      });

      it('should be valid with id, username, role', function () {
        var s = mlSession.create({
          id: 'me',
          username: 'theuser',
          role: ['i should come from ldap']
        });
        s.$ml.valid.should.be.true;
      });

      it('should be invalid with id and password', function () {
        var s = mlSession.create({
          id: 'me',
          password: 'notgood'
        });
        s.$ml.valid.should.be.false;
      });

      it('should POST as expected', function (done) {
        helper.setExpectCsrf($httpBackend);
        $httpBackend.expectPOST(/\/v1\/login$/).respond(200, {
          id: 'someid',
          username: 'username',
          someProp: 'val'
        });

        var s = mlSession.create({
          username: 'username',
          password: 'password'
        });

        mlSession.post(s);
        s.$ml.waiting.then(
          function () {
            s.instance.id.should.equal('someid');
            s.instance.someProp.should.equal('val');
            s.instance.should.not.have.property('password');
            done();
          },
          function (reason) { assert(false, JSON.stringify(reason)); done(); }
        );

        $httpBackend.flush();
      });
    });
  };

});
