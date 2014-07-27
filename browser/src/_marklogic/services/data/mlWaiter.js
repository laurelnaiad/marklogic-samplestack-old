/*
this is provisional -- to be refactored to follow basic patterns that
Angular 2.0 is pointing towards where we're doing the same thing they are
planning to put into core -- this may mean that mlWaiter is factored into
somethign that looks more like Angular's ChangeEvent and oorresponding hooks
in models and the store.
 */
define(['_marklogic/module'], function (module) {

  module.factory('mlWaiter', [
    '$q',
    function ($q) {
      return {
        waitOn: function (obj) {
          if (!obj.$ml) {
            obj.$ml = {};
          }
          delete obj.$ml.error;

          // this one is for anyone who wants to watch it, it will
          // disappear on its own if nobody does so;
          var myDeferred = $q.defer();
          obj.$ml.waiting = myDeferred.promise;

          // this one is for me to be notified when things are finished
          // one way or the other.
          var mySignal = $q.defer();
          mySignal.promise.then(
            function () {
              delete obj.$ml.waiting;
              myDeferred.resolve();
            },
            function (reason) {
              obj.$ml.error = reason;
              delete obj.$ml.waiting;
              myDeferred.reject(reason);
            }
          );
          return mySignal;
        }
      };
    }
  ]);
});
