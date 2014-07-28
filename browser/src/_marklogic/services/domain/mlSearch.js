define(['_marklogic/module'], function (module) {

  module.factory('mlSearch', [

    'mlHttp', 'mlModel', 'mlSchema',
    function (
      mlHttp, mlModel, mlSchema
    ) {

      mlSchema.addSchema({
        id: 'http://marklogic.com/#searchSpec',
        required: ['query'],
        additionalProperties: true,
        properties: {
          query: {
            type: 'object',
            required: ['qtext'],
            properties: {
              qtext: { type: 'string' }
            }
          }
        }
      });

      mlSchema.addSchema({
        id: 'http://marklogic.com/#searchResults',
        additionalProperties: true,
        properties: {
        }
      });

      return mlModel.extend({
        schema: {
          id: 'http://marklogic.com/#search',
          required: ['spec'],
          additionalProperties: true,
          properties: {
            spec: { $ref: 'http://marklogic.com/#searchSpec' },
            results: { $ref: 'http://marklogic.com/#searchResults' }
          }
        },
        proto: {
          assignInstance: function (obj) {
            _.merge(this, { instance: obj });
            this.setValidity();
          },
          assignInstanceHttp: function (obj) {
            _.merge(this, { instance: obj });
            this.setValidity();
          },
          extractInstanceHttp: function () {
            return this.instance.spec;
          }
        }
      });
      // mlSchema.addSchema({
      //   id: 'http://marklogic.com/#sessionPrelogin',
      //   required:['username', 'password'],
      //   properties: {
      //     username: { type: 'string', minLength: '5' },
      //     password: { type: 'string', minLength: '5' },
      //     id: { not: {} }
      //   }
      // });
      //
      // mlSchema.addSchema({
      //   id: 'http://marklogic.com/#sessionPostlogin',
      //   required:['username', 'id', 'role'],
      //   properties: {
      //     username: { type: 'string', minLength: '5' },
      //     password: { not: {} },
      //     id: { type: 'string', minLength: '1' },
      //     role: { type: 'array', items: { type: 'string' } },
      //   }
      // });
      //
      // return mlModel.extend({
      //   schema: {
      //     id: 'http://marklogic.com/#session',
      //     oneOf: [
      //       { $ref: 'http://marklogic.com/#sessionPrelogin' },
      //       { $ref: 'http://marklogic.com/#sessionPostlogin'}
      //     ]
      //   },
      //   proto: {
      //     assignInstance: function (obj) {
      //       this.instance = obj;
      //       this.setValidity();
      //     }
      //   }
      // });

    }
  ]);
});
