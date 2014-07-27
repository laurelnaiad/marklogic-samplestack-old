define([
  './directives/index.unit',
  './services/index.unit',
  './states/index.unit'
], function (
  directives,
  services,
  states
) {
  return function () {

    describe('app', function () {
      directives();
      services();
      states();
    });

  };
});
