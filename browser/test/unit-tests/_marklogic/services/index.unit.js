define([
  './http/index.unit',
  './model/index.unit'
], function (
  http,
  model
) {

  return function () {

    describe('services', function () {
      http();
      model();
    });

  };
});
