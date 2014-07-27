define(['_marklogic/module'], function (module) {

  module.factory('mlHttpInterceptor', [
    // we inject injector in order to avoid circular dependency on $http
    '$injector', '$q', 'mlUtil', 'appSettings',
    function ($injector, $q, mlUtil, appSettings) {

      var $http;
      var outstanding;

      var csrfMethods = {
        'POST': true,
        'PUT': true,
        'PATCH': true,
        'DELETE': true
      };

      // whether or not we need to get csrf before doing what the app
      // actually wants
      var mustGetCsrf = function (config) {

        return csrfMethods[config.method]
            && !$http.defaults.headers.common['X-CSRF-TOKEN'];
      };

      // return a promise to have set the csrf header default. To do this,
      // round-trip with the server on get /v1/session
      var setCsrf = function () {
        if (outstanding) {
          return outstanding;
        }
        else {
          var requestConfig = {
            method: 'GET',
            url: '/v1/session',
            doNotOverride: true
          };
          var deferred = $q.defer();
          $http(requestConfig).then(
            function (response) {
              // if the server doesn't give us a CSRF token, we should
              // we complain? TODO
              var token = response.headers('X-CSRF-TOKEN');
              if (token){
                $http.defaults.headers.common['X-CSRF-TOKEN'] = token;
              }
              else {
                $http.defaults.headers.common['X-CSRF-TOKEN'] = 'dummy';
              }
              deferred.resolve(token);
            },
            function (reason) {
              deferred.reject(new Error('unable to get CSRF token', reason));
            }
          );

          outstanding = deferred.promise;
          return outstanding;
        }
      };

      var setCsrfThenResolveConfig = function (config) {
        var deferred = $q.defer();

        setCsrf().then(
          function (token) {
            config.headers['X-CSRF-TOKEN'] = token;
            deferred.resolve(config);
          },
          deferred.reject
        );

        return deferred.promise;
      };

      // the interceptor service
      //

      return {

        request: function (config) {
          // ensure we have $http
          $http = $http || $injector.get('$http');

          if (config.doNotOverride) {
            delete config.doNotOverride;
            return config;
          }
          else {
            // POST /v1/session is implemented as POST /v1/login
            if (config.url.match(/\/v1\/session/) && config.method === 'POST') {
              config.url = config.url.replace(
                /(.*)(\/v1\/session)$/, '$1/v1/login'
              );
            }

            // GET /v1/session is implemented as GET /v1/contributor
            // session is hokey for a few reasons --
            // a) it doesn't return session info once logged in
            // b) it actually doesn't work at all ATM
            // c) when we try to;post to it we have to turn it into a login
            // post b/c the rest api expects posts to login rather than
            // session.
            // doNotOverride means this is the kind of GET /v1/session
            // that we really need to do (subject to CSRF actually working
            // and the endpoint really working)
            if (config.url.match(/\/v1\/session\/.+/) &&
                (config.method === 'GET' || config.method === 'OPTIONS') &&
                !config.doNotOverride
              ) {
              config.url = config.url.replace(
                /(.*)(\/v1\/session\/)(.+)/, '$1/v1/contributors/$3'
              );
            }

            // login requires form-encoding
            if (config.url.match(/\/v1\/login/) && config.method === 'POST') {
              config.headers['Content-Type'] =
                  'application/x-www-form-urlencoded';
              config.data =
                  'username=' + encodeURI(config.data.username) + '&' +
                  'password=' + encodeURI(config.data.password);
            }

            if (appSettings.disableCsrf) {
              return config;
            }
            else {
              if (mustGetCsrf(config)) {
                return setCsrfThenResolveConfig(config);
              }
              else {
                return config;
              }

            }
          }
        }
      };

    }
  ]);

  module.config([
    '$httpProvider',
    function ($httpProvider) {
      $httpProvider.interceptors.push('mlHttpInterceptor');
    }
  ]);

});
