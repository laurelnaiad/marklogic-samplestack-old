define([
  './mlSchema.unit',
  './mlSearchParams.unit',
], function (
  mlSchema,
  mlSearchParams
) {

  return function () {

    describe('model', function () {
      mlSchema();
      mlSearchParams();
    });

  };
});
