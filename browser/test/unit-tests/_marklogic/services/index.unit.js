define([
  './mlAuth.unit',
  './http/index.unit',
  './model/index.unit',
  './search/index.unit'
], function (
  mlAuth,
  http,
  model,
  search
) {

  return function () {

    describe('services', function () {
      mlAuth();
      http();
      model();
      search();
    });

  };
});
