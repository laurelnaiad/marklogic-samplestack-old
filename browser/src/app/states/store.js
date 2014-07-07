/*
store.js

 */

define(['app/module'], function (module) {

  module.controller('storeCtlr', [

    '$scope', 'mlStore', 'ssModel',
    function ($scope, mlStore, ssModel) {
      // allows access to the scope on which events will be raised
      mlStore.scope = $scope;
    }

  ]);

});
