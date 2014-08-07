define([
  'json!./searchResult1.json',
  'json!./contributor.json',
  'json!./searchObj.json'
], function (
  searchResult,
  contributor,
  searchObj
) {
  return {
    searchResult: searchResult,
    contributor: contributor,
    searchObj: searchObj
  };
});
