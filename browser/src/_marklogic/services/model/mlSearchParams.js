define(['_marklogic/module'], function (module) {

  module.factory('mlSearchParams', [

    'mlModel', 'mlSchema', 'mlUtil',
    function (
      mlModel, mlSchema, mlUtil
    ) {

      /**
       * @constructor
       * @param  {[type]} spec [description]
       * @return {[type]}      [description]
       */
      var MlSearchParams = function (spec) {

        // mlUtil.extend(this, spec);
        mlUtil.extend(this, spec);
        this.validate(this);
      };

      MlSearchParams.prototype.schema = {

        $schema: 'http://json-schema.org/draft-04/schema#',
        id: 'http://marklogic.com/#searchParams',
        type: 'object',
        properties: {
          query: {
            type: 'object',
            properties: {
              qtext: { type: 'string' }
            }
          },
          'and-query': {
            type: 'object',
            properties: {
              queries: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    'range-constraint-query': {
                      type: 'object',
                      required: ['constraint-name', 'text'],
                      properties: {
                        'constraint-name': 'string',
                        text: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      MlSearchParams.prototype.validate = function () {

        return mlSchema.validate(this, this.schema);

      };



// {
//   "query":{
//     "qtext":[
//       "tried",
//       "sort:active"
//     ],
//     "and-query":{
//       "queries":[
//         {
//           "range-constraint-query":{
//             "constraint-name":"tag",
//             "text":"javascript"
//           }
//         }
//       ]
//     }
//   }
// }
      MlSearchParams.create = function (spec) {
        return new MlSearchParams(spec);
      };

      return MlSearchParams;

    }
  ]);
});
