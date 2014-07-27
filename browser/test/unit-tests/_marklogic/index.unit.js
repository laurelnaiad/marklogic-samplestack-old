define([
  './directives/index.unit',
  './filters/index.unit',
  './services/index.unit'
], function (
  directives,
  filters,
  services
) {
  return function () {

    describe('_marklogic', function () {
      directives();
      filters();
      services();
    });

  };
});
