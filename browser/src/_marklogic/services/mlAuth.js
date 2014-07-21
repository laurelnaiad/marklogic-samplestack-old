define(['_marklogic/module'], function (module) {

  module.provider('mlAuth', [

    function () {

      this.credentialsService = 'MlCredentialsModel';
      this.userService = 'MlUserModel';

      this.$get = [
        '$rootScope',
        '$q',
        '$cookieStore',
        this.credentialsService,
        this.userService,
        'mlHttpAdapter',
        'mlUtil',
        'mlStore',
        function (
          $rootScope,
          $q,
          $cookieStore,
          CredentialsModel,
          UserModel,
          mlHttpAdapter,
          mlUtil,
          mlStore
        ) {
          if (!mlStore.currentUser) {
            var uCook = $cookieStore.get('currentUser');
            if (uCook) {
              mlStore.currentUser = new UserModel(uCook);
            }
          }

          var svc = {};

          svc.authenticate = function (credentials) {
            var deferred = $q.defer();

            var user = mlHttpAdapter.post(credentials);
            user.$mlWaiting.then(
              function (user) {
                mlStore.currentUser = user;
                var toStore =
                $cookieStore.put('currentUser', user.value);

                deferred.resolve(user);
              },
              deferred.reject
            );
            return deferred.promise;
          };

          svc.logout = function () {
            mlStore.currentUser = null;
            $cookieStore.remove('currentUser');
          };

          return svc;
        }
      ];
    }




  ]);

});
