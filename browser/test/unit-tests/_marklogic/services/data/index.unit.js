define([
  './mlHttp.unit',
  './mlHttpInterceptor.unit',
  './mlSchema.unit',
  './mlWaiter.unit'
], function (
  mlHttp,
  mlHttpInterceptor,
  mlSchema,
  mlWaiter
) {
  return function () {
    describe('data', function () {
      mlHttp();
      mlHttpInterceptor();
      mlSchema();
      mlWaiter();
    });
  };
});
