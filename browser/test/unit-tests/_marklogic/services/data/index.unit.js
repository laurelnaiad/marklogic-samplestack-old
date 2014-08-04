define([
  './mlHttpInterceptor.unit',
  './mlSchema.unit',
  './mlWaiter.unit'
], function (
  mlHttpInterceptor,
  mlSchema,
  mlWaiter
) {
  return function () {
    describe('data', function () {
      mlHttpInterceptor();
      mlSchema();
      mlWaiter();
    });
  };
});
