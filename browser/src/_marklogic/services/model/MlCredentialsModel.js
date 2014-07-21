define(['_marklogic/module'], function (module) {

  module.factory('MlCredentialsModel', [

    'MlModel', 'mlSchema', 'MlUserModel',
    function (
      MlModel, mlSchema, MlUserModel, mlUtil
    ) {

      var MlCredentialsModel = function (spec) {
        MlModel.call(this, spec);
      };

      MlCredentialsModel.prototype = MlModel.prototype;

      MlCredentialsModel.prototype.$schema = mlSchema.addSchema({
        id: 'http://marklogic.com/#credentials',
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
      });

      MlCredentialsModel.prototype.operations = {
        'POST': {
          endpoint: '/login',
          expects: MlUserModel
        }
      };

      return MlCredentialsModel;

    }
  ]);
});
