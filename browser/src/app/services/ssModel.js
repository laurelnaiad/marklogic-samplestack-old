define(['app/module'], function (module) {

  module.factory('ssModel', [

    'mlModel',
    function (mlModel) {

      var Tag = function (spec) {

        _.merge(this, spec);

        mlModel.call(this);
      };

      Tag.prototype = Object.create(mlModel.prototype, {
      });

      //static functions
      _.merge(Tag, mlModel, {
        create: function (spec) {
          return new Tag(spec);
        },
        find: function (spec) {
          return [
            Tag.create( { name: 'tag1', count: 6 } ),
            Tag.create( { name: 'tag2', count: 2 } )
          ];
        }
      });

      return {

        tag: Tag
      };
    }

  ]);
});
