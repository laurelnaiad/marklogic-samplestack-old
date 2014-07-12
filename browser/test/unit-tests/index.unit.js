define([
  '_marklogic/index.unit',
  'app/services/ssModel.unit',
  'app/states/store.unit'
], function (
  marklogic,
  ssModel,
  store
) {
  describe('unit tests', function () {

    marklogic();

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
