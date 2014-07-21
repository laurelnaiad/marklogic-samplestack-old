define([
  './mlAuth.unit',
  './http/index.unit',
  './model/index.unit'
], function (
  mlAuth,
  http,
  model
) {

  return function () {

    describe('services', function () {
      mlAuth();
      http();
      model();
    });

  };
});
