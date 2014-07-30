define([
  './mlAuth.unit',
  './mlUtil.unit',
  './data/index.unit',
  './domain/index.unit',
  './search/index.unit'
], function (
  mlAuth,
  mlUtil,
  data,
  domain,
  search
) {

  return function () {

    describe('services', function () {
      mlAuth();
      mlUtil();
      data();
      domain();
      search();
    });

  };
});
