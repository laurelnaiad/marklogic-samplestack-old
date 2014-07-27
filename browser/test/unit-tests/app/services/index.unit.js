define([
  './domain/index.unit'
], function (
  domain
) {

  return function () {

    describe('services', function () {
      domain();
    });

  };
});
