define([
  '_marklogic/module',
  'moment'
], function (
  module,
  moment
) {
  var deepExtend = function (dst) {
    angular.forEach(arguments, function (obj) {
      if (obj !== dst) {
        angular.forEach(obj, function (value, key) {
          if (dst[key] &&
              dst[key].constructor &&
              dst[key].constructor === Object
          ) {
            deepExtend(dst[key], value);
          }
          else {
            dst[key] = value;
          }
        });
      }
    });
    return dst;
  };

  module.constant('mlUtil', {
    moment: moment,
    deepExtend: deepExtend
  });

});
