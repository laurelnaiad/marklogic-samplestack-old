define([
  './mlSchema.unit'
], function (
  mlSchema
) {

  return function () {

    describe('model', function () {
      mlSchema();
    });

  };
});
