define([
  './mlSchema.unit',
  './mlSearchParams.unit'
], function (
  mlSchema,
  mlSearch
) {

  return function () {

    describe('model', function () {
      mlSchema();
      mlSearch();
    });

  };
});
