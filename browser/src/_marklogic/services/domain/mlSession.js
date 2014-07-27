define(['_marklogic/module'], function (module) {

  module.factory('mlSession', [

    'mlHttp', 'mlModel', 'mlSchema',
    function (
      mlHttp, mlModel, mlSchema
    ) {
      mlSchema.addSchema({
        id: 'http://marklogic.com/#sessionPrelogin',
        required:['username', 'password'],
        properties: {
          username: { type: 'string', minLength: '5' },
          password: { type: 'string', minLength: '5' },
          id: { not: {} }
        }
      });

      mlSchema.addSchema({
        id: 'http://marklogic.com/#sessionPostlogin',
        required:['username', 'id', 'role'],
        properties: {
          username: { type: 'string', minLength: '5' },
          password: { not: {} },
          id: { type: 'string', minLength: '1' },
          role: { type: 'array', items: { type: 'string' } },
        }
      });

      return mlModel.extend({
        schema: {
          id: 'http://marklogic.com/#session',
          oneOf: [
            { $ref: 'http://marklogic.com/#sessionPrelogin' },
            { $ref: 'http://marklogic.com/#sessionPostlogin'}
          ]
        },
        proto: {
          assignInstance: function (obj) {
            this.instance = obj;
            this.setValidity();
          }
        }
      });

    }
  ]);
});
