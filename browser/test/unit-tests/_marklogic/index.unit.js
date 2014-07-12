define([
  './directives/index.unit',
  './services/index.unit'
], function (
  directives,
  services
) {
  return function () {

    describe('_marklogic', function () {
      directives();
      services();
    });

  };
});
