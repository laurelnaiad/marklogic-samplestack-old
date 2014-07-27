define([
  './data/index.unit',
  './domain/index.unit',
  './search/index.unit'
], function (
  data,
  domain,
  search
) {

  return function () {

    describe('services', function () {
      data();
      domain();
      search();
    });

  };
});
