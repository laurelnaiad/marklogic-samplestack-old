/*

will provide a limited set of operations on data, to allow for easy
implementation of IAdapter. E.g.:

* limit()
* skip()
* find(query)
* findById()
* count()
* order()

 Updating properties of Model instances should be managed through mutator
 methods. Views can bind to plain JavaScript objects as well as Model instances
 in Angular 2.

 */
/*
_marklogic/services/mlModel.js
 */

define(['_marklogic/module'], function (module) {

  module.provider('mlModel', [

    // deps tbd
    function (
      // deps tbd
    ) {

      // TODO -- lots of stuff to be done here
      this.$get = [
        // deps tbd
        function (/*deps tbd */) {
          return {
            tweedle: 'dum'
          };
        }
      ];

    }
  ]);
});
