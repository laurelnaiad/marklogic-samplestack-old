define(['_marklogic/module'], function (module) {

  module.factory('mlUserModel', [

    'mlModel', 'mlSchema', 'mlUtil',
    function (
      mlModel, mlSchema, mlUtil
    ) {

      /**
       * @constructor
       * @param  {[type]} spec [description]
       * @return {[type]}      [description]
       */
      var MlUserModel = function (spec) {
        mlUtil.extend(
          this, {
            username: null,
            password: null
          }, spec
        );
      };

      MlUserModel.prototype.schema = {

        $schema: 'http://json-schema.org/draft-04/schema#',
        id: 'http://marklogic.com/#user',
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
            minLength: '5'
          },
          password: {
            type: 'string',
            minLength: '5'
          }
        }
      };

      MlUserModel.prototype.validate = function () {

        return mlSchema.validate(this, this.schema);

      };

      MlUserModel.create = function (spec) {
        return new MlUserModel(spec);
      };

      return MlUserModel;

    }
  ]);
});
