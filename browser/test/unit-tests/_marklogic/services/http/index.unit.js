define([
  './mlHttpAdapter.unit',
  './mlStore.unit',
  './mlWaiter.unit'
], function (
  mlHttpAdapter,
  mlStore,
  mlWaiter
) {

  return function () {

    describe('http', function () {
      mlHttpAdapter();
      mlStore();
      mlWaiter();
    });

  };
});
