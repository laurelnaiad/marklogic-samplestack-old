/*
store.js

 */

define(['app/module'], function (module) {

  module.controller('storeCtlr', [

    '$scope', 'mlStore',
    function ($scope, mlStore) {
      // allows access to the scope on which events will be raised
      mlStore.scope = $scope;
    }

  ]);

});
