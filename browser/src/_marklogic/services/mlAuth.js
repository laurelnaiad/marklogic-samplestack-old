define(['_marklogic/module'], function (module) {

  module.provider('mlAuth', [

    function () {

      this.sessionModel = 'mlSession';

      this.$get = [
        '$q',
        '$cookieStore',
        'mlStore',
        // overriden by many apps, in part due to funny business on
        this.sessionModel,
        function (
          $q,
          $cookieStore,
          mlStore,
          sessionModel
        ) {
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
            throw new Error('not implemented');
            // ditch the session from the store
            // ditch the cookie
            // attempt to log out from the server (but if the server
            // is down we still proceed
            // need to figure out what the java tier is setting for path of
            // its cookie to get a full wipe
          };

          return svc;
        }
      ];
    }




  ]);

});
