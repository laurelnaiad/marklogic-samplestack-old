define(['app/module'], function (module) {

  /**
   * @ngdoc service
   * @name ssSearch
   * @requires mlModelBase
   * @requires mlSchema
   * @requires mlSeearch
   *
   * @description
   * TBD
   *
   */

  module.factory('ssSearch', [

    'mlModelBase', 'mlSchema', 'mlSearch', 'mlUtil',
    function (
      mlModelBase, mlSchema, mlSearch, mlUtil
    ) {

      var mlSearchObj = mlSearch.object;

      var SsSearchObject = function (spec) {
        spec = mlUtil.merge(
          {
            criteria: {
              constraints: {
                resolvedOnly: {
                  constraintName: 'resolved',
                  type: 'boolean',
                  queryStringName: 'resolved'
                },
                userName: {
                  constraintName: 'userName',
                  type: 'text',
                  queryStringName: 'user'
                },
                tags: {
                  constraintName: 'tag',
                  type: 'enum',
                  subType: 'text',
                  queryStringName: 'tags'
                },
                dateStart: {
                  constraintName: 'activity-date',
                  type: 'date',
                  queryStringName: 'date-start'
                },
                dateEnd: {
                  constraintName: 'activity-date',
                  type: 'date',
                  queryStringName: 'date-end'
                }
              }
            }
          },
          spec
        );
        mlSearch.object.call(this, spec);
      };
      SsSearchObject.prototype = Object.create(
        mlSearch.object.prototype
      );
      SsSearchObject.prototype.$mlSpec.schema = mlSchema.addSchema({
        id: 'http://marklogic.com/samplestack#search',
        allOf: [
          { $ref: 'http://marklogic.com/#search' }
        ],
        properties: {
          criteria: {
            constraints: {
              userName: {
                constraintName: { enum: ['userName'] },
                type: { enum: ['text'] },
                value: { type: ['string', null] },
                queryStringName: 'user'
              },
              resolvedOnly: {
                constraintName: { enum: ['resolved'] },
                type: { enum: ['boolean'] },
                value: { type: ['boolean', null] },
                queryStringName: 'resolved'
              },
              tags: {
                constraintName: { enum: ['tag'] },
                type: { enum: ['enum'] },
                subType: { enum: ['string'] },
                values: { type: ['array', null] },
                queryStringName: 'tags'
              },
              dateStart: {
                constraintName: { enum: ['last-activity'] },
                operator: { enum: ['GT'] },
                type: { enum: ['date'] },
                value: { type: ['date', null] },
                queryStringName: 'date-start'
              },
              dateEnd: {
                constraintName: { enum: ['last-activity'] },
                operator: { enum: ['LT'] },
                type: { enum: ['date'] },
                value: { type: ['date', null] },
                queryStringName: 'date-end'
              }
            }
          }
        }
      });

      return mlModelBase.extend('SsSearchObject', SsSearchObject);
    }
  ]);
});
