define([
  './_layout.unit',
  './_root.unit',
  './explore.unit',
  './fourOhFour.unit'
], function (
  _layout,
  _root,
  explore,
  fourOhFour
) {

  return function () {

    describe('states', function () {
      _layout();
      _root();
      explore();
      fourOhFour();
    });

  };
});
