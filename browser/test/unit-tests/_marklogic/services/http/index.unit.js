define([
  './mlHttpAdapter.unit',
  './mlStore.unit'
], function (
  mlHttpAdapter,
  mlStore
) {

  return function () {

    describe('http', function () {
      mlHttpAdapter();
      mlStore();
    });

  };
});
