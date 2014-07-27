define([
  './mlAuth.unit',
  './data/index.unit',
  './domain/index.unit',
  './search/index.unit'
], function (
  mlAuth,
  data,
  domain,
  search
) {

  return function () {

    describe('services', function () {
      mlAuth();
      data();
      domain();
      search();
    });

  };
});
