define([
  './ssAccountDropdown.unit',
  './ssFacetDateRange.unit',
  './ssMarkdownEditor.unit'
], function (
  ssAccountDropdown,
  ssFacetDateRange,
  ssMarkdownEditor
) {

  return function () {

    describe('directives', function () {
      ssAccountDropdown();
      ssFacetDateRange();
      ssMarkdownEditor();
    });

  };
});
