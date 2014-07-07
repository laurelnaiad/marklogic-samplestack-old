define([
  '_marklogic/index.unit',
  'app/index.unit'
], function (
  marklogic,
  app
) {
  describe('unit tests', function () {
    marklogic();
    app();
  });
});
