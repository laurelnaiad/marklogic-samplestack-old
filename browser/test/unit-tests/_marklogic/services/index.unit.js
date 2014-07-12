define([
  './mlSchema.unit',
  './mlStore.unit'
], function (
  mlSchema,
  mlStore
) {

  return function () {

    describe('services', function () {
      mlSchema();
      mlStore();
    });

  };
});
