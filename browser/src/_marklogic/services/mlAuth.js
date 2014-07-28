define(['_marklogic/module'], function (module) {

  module.provider('mlAuth', [

    function () {

      this.sessionModel = 'mlSession';

      this.$get = [
        '$rootScope',
        '$q',
        '$cookieStore',
        'mlStore',
        // overriden by many apps, in part due to funny business on
        this.sessionModel,
        function (
          $rootScope,
          $q,
          $cookieStore,
          mlStore,
          sessionModel
        ) {

          $rootScope.$on('logout', function () {
            svc.logout();
          });

          var svc = {};

          svc.restoreActiveSession = function () {
            var deferred = $q.defer();

            if (!mlStore.session) {
              var sessionId = $cookieStore.get('sessionId');
              if (sessionId) {

                var sess = sessionModel.getOne(sessionId);
                sess.$ml.waiting.then(
                  // TODO: if/we we have an auth interceptor, this one
                  // should be exempt from it -- we'd prefer to drop the
                  // session silently
                  function () {
                    $cookieStore.put('sessionId', sess.instance.id);
                    mlStore.session = sess;
                    deferred.resolve(sess);
                  },
                  function () {
                    // don't really care -- we just don't have a session
                    // won't clear cookie b/c might work next time
                    deferred.resolve();
                  }
                );
              }
              else {
                // we don't think we have a session
                deferred.resolve();
              }
            }
            else {
              deferred.resolve(mlStore.session);
            }
            return deferred.promise;
          };

          svc.authenticate = function (session) {
            var deferred = $q.defer();

            var sess = sessionModel.post(session);
            sess.$ml.waiting.then(
              function () {
                mlStore.session = sess;
                $cookieStore.put('sessionId', sess.instance.id);
                deferred.resolve(sess);
              },
              deferred.reject
            );
            return deferred.promise;
          };

          svc.logout = function () {
            var deferred = $q.defer();

            var successHandler = function () {
              $cookieStore.remove('sessionId');
              delete mlStore.session;
              deferred.resolve();
            };
            // the heaviest part of being logged in is the cookie
            // the rest we'll just wipe out
            var sessionId = $cookieStore.get('sessionId');


            sessionModel.delete(sessionId).then(
              successHandler,

              // unfortunately we'll end up here not knowing if there was a
              // REAL problem b/c the REST api is trying to do a readirect
              // on logout ..... so we treat this as success until that's
              // fixed
              successHandler
            );
            return deferred.promise;
          };

          return svc;
        }
      ];
    }
  ]);

});
