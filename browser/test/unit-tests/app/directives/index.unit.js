define([
  './ssAccountDropdown.unit',
  './ssFacetDateRange.unit'
], function (
  ssAccountDropdown,
  ssFacetDateRange
) {

  return function () {

    describe('directives', function () {
      ssAccountDropdown();
      ssFacetDateRange();
    });

  };
});
