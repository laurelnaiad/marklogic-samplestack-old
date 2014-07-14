define([
  '_marklogic/module'
], function (
  module
) {

  var extendDeep = function (dst) {
    angular.forEach(arguments, function (obj) {
      if (obj !== dst) {
        angular.forEach(obj, function (value, key) {
          if (dst[key] &&
              dst[key].constructor &&
              dst[key].constructor === Object
          ) {
            extendDeep(dst[key], value);
          }
          else {
            dst[key] = value;
          }
        });
      }
    });
    return dst;
  };

  // created before writing simple angular version
  module.constant('mlUtil', {
    extend: extendDeep,
    // shellQuote: shellQuote
  });

});
