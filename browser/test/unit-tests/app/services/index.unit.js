define([
  './model/index.unit'
], function (
  model
) {

  return function () {

    describe('services', function () {
      model();
    });

  };
});
