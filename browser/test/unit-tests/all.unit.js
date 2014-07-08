define([
  '_marklogic/services/data/mlStore.unit',
  'app/services/ssModel.unit',
  'app/states/store.unit'
], function (
  mlStore,
  ssModel,
  store
) {
  describe('unit tests', function () {
    describe('_marklogic', function () {
      describe('directives', function () {

      });
      describe('services', function () {
        mlStore();
      });
    });
    describe('app', function () {
      describe('directives', function () {

      });
      describe('services', function () {
        ssModel();
      });
      describe('states', function () {
        store();
      });
    });
  });
});
