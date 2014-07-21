define(['_marklogic/module'], function (module) {

  module.factory('MlUserModel', [

    'MlModel', 'mlSchema',
    function (
      MlModel, mlSchema
    ) {


      var MlUserModel = function (spec) {
        MlModel.call(this, spec);
      };

      MlUserModel.prototype = MlModel.prototype;

      MlUserModel.prototype.$schema = mlSchema.addSchema({
        id: 'http://marklogic.com/#user',
        type: 'object',
        required: ['userName', 'displayName'],
        properties: {
          userName: {
            type: 'string',
            minLength: '5'
          },
          displayName: {
            type: 'string',
            minLength: '5'
          }
        }
      });

      // we don't directly get user, it comes back from logging in,
      // and we haven't implemented any modifyability
      // MlUserModel.prototype.operations = {
      //   'POST': {
      //     endpoint: '/login',
      //     expects: MlUserModel
      //   }
      // };

      return MlUserModel;

    }
  ]);
});
