define(['testHelper'], function (helper) {

  return function () {

    describe('mlAuth', function () {
      var $httpBackend;
      var mlAuth;
      var mlStore;
      var $cookieStore;
      var mlSession;
      var $rootScope;
      var $timeout;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (
            _$httpBackend_,
            _$cookieStore_,
            _mlStore_,
            _mlAuth_,
            _mlSession_,
            _$rootScope_,
            _$timeout_
          ) {
            $httpBackend = _$httpBackend_;
            mlAuth = _mlAuth_;
            mlStore = _mlStore_;
            $cookieStore = _$cookieStore_;
            mlSession = _mlSession_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
            done();
          }
        );
      });

      var credsTemplate = {
        username: 'joseph',
        password: 'joespass'
      };
      var fakeId = 'seven';
      var userTemplate = _.clone(credsTemplate);
      delete userTemplate.password;
      userTemplate.id = fakeId;
      userTemplate.role = ['hey Iz a role'];

      var setExpectFormEncoded = function () {
        $httpBackend.expectPOST(
          /\/v1\/login$/,
          function (body) {
            return body ===
                'username=' + encodeURI(credsTemplate.username) + '&' +
                'password=' + encodeURI(credsTemplate.password);
          },
          function (headers) {
            var encoded = headers['Content-Type'] ===
                'application/x-www-form-urlencoded';
            return encoded;
          }
        ).respond(userTemplate);

      };

      var doAuthenticate = function (done) {
        var session = mlSession.create(credsTemplate);

        helper.setExpectCsrf($httpBackend);
        setExpectFormEncoded();

        mlAuth.authenticate(session).then(
          function (session) {
            done(session);
          },
          function (reason) { assert(false, reason); done(); }
        );
        $httpBackend.flush();
      };

      var testSessionGoodness = function (session) {
        // got the data back
        session.instance.should.deep.equal(userTemplate);
        // have a valid MlUserModel instance
        session.$ml.valid.should.be.true;
        mlStore.session.instance.should.deep.eql(session.instance);
        $cookieStore.get('sessionId').should.equal('seven');
      };

      var testSessionBadness = function () {
        // got the data back
        mlStore.should.not.have.property('session');
        expect($cookieStore.get('sessionId')).to.be.null;
      };

      describe('authenticate', function () {
        it('should authenticate', function (done) {
          doAuthenticate(function (session) {
            testSessionGoodness(session);
            done();
          });
        });
      });

      describe('restoreSession', function () {
        it('should pass back session if still in store', function (done) {
          doAuthenticate(function (session) {
            mlAuth.restoreSession().then(
              function (session) {
                testSessionGoodness(session);
                done();
              },
              function (reason) {
                assert(false, JSON.stringify(reason));
                done();
              }
            );
          });
        });

        it('should survive store wipeout', function (done) {
          doAuthenticate(function (session) {
            mlStore.session = null;

            $httpBackend.expectGET(/\/v1\/contributors\/.+$/)
                .respond(userTemplate);
            mlAuth.restoreSession().then(
              function (session) {
                testSessionGoodness(session);
                done();
              },
              function (reason) {
                assert(false, JSON.stringify(reason));
                done();
              }
            );
          });
        });

        it('should not upset anthing if server fail', function (done) {
          doAuthenticate(function (session) {
            mlStore.session = null;

            $httpBackend.expectGET(/\/v1\/contributors\/.+$/)
                .respond(401);
            mlAuth.restoreSession().then(
              function (session) {
                expect(session).be.undefined;
                $cookieStore.get('sessionId').should.equal('seven');
                done();
              },
              function (reason) {
                assert(false, JSON.stringify(reason));
                done();
              }
            );
          });
        });

        it('should do nothing if no session info', function (done) {
          doAuthenticate(function (session) {
            mlStore.session = null;
            $cookieStore.remove('sessionId');

            mlAuth.restoreSession().then(
              function (session) {
                expect(session).be.undefined;
                done();
              },
              function (reason) {
                assert(false, JSON.stringify(reason));
                done();
              }
            );
          });
        });

        xit(
          '(having trouble with flushing the promise)\n' +
          'should logout when rootscope gets a logout request event',
          function () {
            doAuthenticate(function (session) {
              $httpBackend.expectDELETE(/\/v1\/session\/.+/).respond(200);
              $rootScope.$apply(
                function () {
                  $rootScope.$broadcast('logout');
                  $httpBackend.flush();
                }
              );
            });
          }
        );

      });


    });
  };

});
