define(['_marklogic/module'], function (module) {

  /**
   * @ngdoc service
   * @name mlSearch
   * @requires mlModelBase
   * @requires mlSchema
   *
   * @description
   * An mlModel element that represents a MarkLogic search. Has both criteria
   * and results. It is posted to effect the search based on the criteria.
   *
   * @example
   *  <example module="mlSearchExample">
   *    <file name="search.js">
   *      angular.module('mlSearchExample', ['marklogic'])
   *        .controller('ExxampleController', [
   *          '$scope', 'mlSearch',
   *          function ($scope, mlSearch) {
   *            var search = mlSearch.create({
   *              criteria: {
   *                query: { qtext: '"red flag"' }
   *              }
   *            });
   *            search.post().$ml.waiting.then(
   *              function () {
   *                console.log('there are ' + search.results.count +
   *                    'items in the results!'
   *                );
   *              },
   *              handleError
   *            );
   *          }
   *        ]);
   *    </file>
   *  </example>
   */
  module.factory('mlSearch', [

    'mlModelBase', 'mlSchema',
    function (
      mlModelBase, mlSchema
    ) {

      mlSchema.addSchema({
        id: 'http://marklogic.com/#searchCriteria',
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
        required: ['start', 'total', 'page-length', 'items'],
        properties: {
          start: { type: 'integer' },
          total: { type: 'integer' },
          'page-length': { type: 'integer' },
          items: {
            type: 'array',
            items: { type: 'object' }
          },
          facets: {
            type: 'object',
            patternProperties: {
              '^.+$': { $ref: 'http://marklogic.com/#searchResultsFacet' }
            }
          }
        }
      });

      mlSchema.addSchema({
        id: 'http://marklogic.com/#searchResultsFacet',
        required: ['type', 'facetValues'],
        additionalProperties: true,
        properties: {
          type: { type: 'string' },
          'facetValues': {
            type: 'array',
            items: { type: 'object'}
          }
        }
      });

      var throwMethod = function (method) {
        return function () {
          throw new Error('mlSearch does not implement ' + method);
        };
      };

      var MlSearchObject = function (spec) {
        mlModelBase.object.call(this, spec);
      };
      MlSearchObject.prototype = Object.create(mlModelBase.object.prototype);
      MlSearchObject.prototype.$mlSpec = {
        schema: mlSchema.addSchema({
          id: 'http://marklogic.com/#search',
          required: ['criteria'],
          additionalProperties: true,
          properties: {
            criteria: { $ref: 'http://marklogic.com/#searchCriteria' },
            results: { $ref: 'http://marklogic.com/#searchResults' }
          }
        })
      };
      MlSearchObject.prototype.put = throwMethod('PUT'),
      MlSearchObject.prototype.del = throwMethod('DELETE'),
      MlSearchObject.prototype.getOne = throwMethod('GET'),
      MlSearchObject.prototype.onResponsePOST = function (data) {
        data.items = data.results;
        delete data.results;
        this.results = data;
      };
      MlSearchObject.prototype.getHttpDataPOST = function (httpMethod) {
        return this.criteria;
      };

      return mlModelBase.extend('MlSearchObject', MlSearchObject);
    }
  ]);
});
