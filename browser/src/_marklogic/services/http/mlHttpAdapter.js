/*
The IAdapter interface specifies the methods that should be implemented by a
participating Adapter in order to make synchronizing Models with a server Just
Work. When instances of Model are created, they should be constructed with an
implementation of IAdapter, unless the Model is never meant to be persisted to
a server.

The IAdapter interface may allow adapters to provide more efficient and
sophisticated means of synchronizing data, such as supporting patching.

IAdapter Example class FirebaseAdapter implements IAdapter {...}
var fooAdapter = new FirebaseAdapter(‘http://foo’);
var myModel = new Model({adapter: fooAdapter});

Http Considerations The ngHttp module will implement measures to ensure safe
cross-site scripting similar to Angular 1, including but not limited to:

~JSONP support~ (not now) ,
Receiving XSRF tokens, and
passing to origin server as header or cookies.

For higher-level abstractions, such as ngData, it is the framework’s
responsibility to intelligently manage the amount of cached data in storage and
in memory. How this will actually be implemented is TBD, but it will likely be a
process of configurable, auto-expiring data (collections or objects that haven’t
been interacted with in a while), with a garbage collection process that runs
periodically as an app is being used. this will be pretty much out of scope for
us -- at best we may put the API in place with a default implementation that
handles none of this and errs on the side of dumping and re-fetching data so as
not to push memory constraints and to have "fresher" data.
 */

define(['_marklogic/module'], function (module) {

  module.factory('mlHttpInterceptor', [
    function () {

      return {

        request: function (config) {
          if (config.url === '/v1/login' && config.method === 'POST') {
            config.headers['Content-Type'] =
                'application/x-www-form-urlencoded';

            config.data =
                'username=' + encodeURI(config.data.username) + '&' +
                'password=' + encodeURI(config.data.password);
          }
          return config;
        }
      };

    }
  ]);

  module.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('mlHttpInterceptor');
  }]);

  module.provider('mlHttpAdapter', [

    '$httpProvider',
    function (
      $httpProvider
    ) {

      /**
       * An adapter that speaks MarkLogicese over HTTP.  Implements an
       * (imaginary) IAdapter interface -- in other words, it has no concept
       * of application semantics, but can do things like
       *
       * * Login
       * * CRUD
       * * Search.
       * * CSRF handling
       *
       * There must be a balance between what is in this class and what is in
       * mlModel. In striking this balance, keep in mind that it _specifies the
       * methods that should be implemented by a participating Adapter in order
       * to make **synchronizing Models with a server Just Work** _.
       *
       * @constructor
       * @param  {[type]} spec [description]
       * @return {[type]}      [description]
       */
      var MlHttpAdapter = function (spec) {

        /**
         * [search description]
         * @param  {mlSearchSpec} spec [description]
         * @return {mlSearchResult} [description]
         */
        this.search = function (spec) {

        };

        /**
         * Will perform a round-trip to get a session and *then* will attempt
         * to authenticate.
         * @param  {mlLoginSpec} spec
         * @return {mlLoginResult} [description]
         */
        this.login = function (spec) {

        };

        this.crud = {

          // get: function ()
          // post: function ()
          // put: function ()
          // delete: function ()
          // patch: function ()
          //
        };

      };

      return {
        $get: function () { return new MlHttpAdapter(); }
      };

    }
  ]);

});
