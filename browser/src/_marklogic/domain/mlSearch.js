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
   *                q: '"red flag"'
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

    'mlModelBase', 'mlSchema', 'mlUtil',
    function (
      mlModelBase, mlSchema, mlUtil
    ) {

      mlSchema.addSchema({
        id: 'http://marklogic.com/#searchCriteria',
        additionalProperties: false,
        properties: {
          q: {
            oneOf: [ { type: 'string' }, { type: 'null' } ]
          },
          constraints: {
            patternProperties: {
              '^.+$': {
                oneOf: [
                  { $ref: 'http://marklogic.com/#searchConstraintText' },
                  { $ref: 'http://marklogic.com/#searchConstraintBoolean' },
                  { $ref: 'http://marklogic.com/#searchConstraintEnum' },
                  { $ref: 'http://marklogic.com/#searchConstraintDate' }
                ]
              }
            }
          }
        }
      });

      mlSchema.addSchema({
        id: 'http://marklogic.com/#searchConstraintText',
        allOf: [
          { $ref: 'http://marklogic.com/#searchConstraintBase' },
          {
            required: ['type'],
            properties: {
              type: { enum: ['text'] },
              value: { type: ['string', 'null' ] }
            }
          }
        ]
      });

      mlSchema.addSchema({
        id: 'http://marklogic.com/#searchConstraintBoolean',
        allOf: [
          { $ref: 'http://marklogic.com/#searchConstraintBase' },
          {
            required: ['type'],
            properties: {
              type: { enum: ['boolean'] },
              value: { type: ['boolean', 'null' ] }
            }
          }
        ]
      });

      mlSchema.addSchema({
        id: 'http://marklogic.com/#searchConstraintEnum',
        allOf: [
          { $ref: 'http://marklogic.com/#searchConstraintBase' },
          {
            required: ['type'],
            properties: {
              type: { enum: ['enum'] },
              values: { type: ['array', 'null' ] }
            }
          }
        ]
      });

      mlSchema.addSchema({
        id: 'http://marklogic.com/#searchConstraintDate',
        allOf: [
          { $ref: 'http://marklogic.com/#searchConstraintBase' },
          {
            required: ['type'],
            properties: {
              type: { enum: ['date'] },
              value: { type: ['date-time', 'null' ] },
              operator: { enum: ['GE', 'LE' ] }
            }
          }
        ]
      });

      mlSchema.addSchema({
        id: 'http://marklogic.com/#searchConstraintBase',
        required: ['constraintName', 'queryStringName'],
        properties: {
          constraintName: { type: 'string' },
          queryStringName: { type: 'string' }
        },
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
        additionalProperties: false,
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
        spec = mlUtil.merge({
          page: 1,
          criteria: {
            q: null,
            constraints: {}
          }
        }, spec);
        mlModelBase.object.call(this, spec);
      };
      MlSearchObject.prototype = Object.create(mlModelBase.object.prototype);
      Object.defineProperty(MlSearchObject.prototype, '$mlSpec', {
        value: {
          schema: mlSchema.addSchema({
            id: 'http://marklogic.com/#search',
            required: ['criteria'],
            additionalProperties: false,
            properties: {
              page: { type: 'integer' },
              criteria: { $ref: 'http://marklogic.com/#searchCriteria' },
              results: { $ref: 'http://marklogic.com/#searchResults' }
            }
          })
        }
      });

      MlSearchObject.prototype.put = throwMethod('PUT'),
      MlSearchObject.prototype.del = throwMethod('DELETE'),
      MlSearchObject.prototype.getOne = throwMethod('GET'),
      MlSearchObject.prototype.onResponsePOST = function (data) {
        data.items = data.results;
        delete data.results;
        this.results = data;
      };

      MlSearchObject.prototype.getMlConstraint = function (constraint) {
        // default and only type of constraint in samplestack is range
        // default and only application of constraints in samplestack
        // is a range query
        // so we are basically hardcoding that everything is a range query
        // in and criteria
        var synt = [];
        var self = this;

        if (constraint.type === 'enum') {
          angular.forEach(constraint.values, function (enumValue) {
            // expand an enum constraint to multiple constraints (remember
            // everything is an and query in samplestack)
            var singleEnum = {
              constraintName: constraint.constraintName,
              operator: constraint.operator,
              type: constraint.subType,
              value: enumValue
            };
            synt = synt.concat(self.getMlConstraint(singleEnum));
          });
        }
        else {
          if (constraint.value) {
            var mySynt = {
              'range-constraint-query': {
                'constraint-name': constraint.constraintName,
                'operator': constraint.operator
              }
            };

            if (constraint.type === 'text') {
              mySynt['range-constraint-query'].text = constraint.value;
            }
            if (constraint.type === 'date') {
              mySynt['range-constraint-query'].value =
                  constraint.value.format('YYYY-MM-DD');
            }
            if (constraint.type === 'boolean') {
              mySynt['range-constraint-query'].value = constraint.value;
            }

            synt.push(mySynt);
          }
        }

        return synt;
      };


      MlSearchObject.prototype.getHttpDataPOST = function (httpMethod) {
        var myCriteria = angular.copy(this.criteria);
        var self = this;

        var criteriaToPost = {
          query: {
            qtext: myCriteria.q || ''
          }
        };

        var andQueries = [];
        angular.forEach(myCriteria.constraints, function (constraint) {
          // concat because some of these contraints will be represented
          // as arrays of constraints
          var newConstraints = self.getMlConstraint(constraint);
          andQueries = andQueries.concat(newConstraints);
        });

        if (andQueries.length) {
          criteriaToPost.query['and-query'] = {
            queries: andQueries
          };
        }

        return criteriaToPost;
      };

      MlSearchObject.prototype.stateParamFromConstraint = function (
        constraint
      ) {
        var param = {};
        if (constraint.type === 'enum') {
          var vals = constraint.values &&
              constraint.values.length &&
              constraint.values.join(',');
          if (vals) {
            param[constraint.queryStringName] = vals;
          }
        }
        if (constraint.type === 'date' ) {
          if (constraint.value) {
            param[constraint.queryStringName] =
                constraint.value.format('YYYY-MM-DD');
          }
        }
        if (constraint.type === 'boolean' ) {
          if (typeof constraint.value === 'boolean') {
            param[constraint.queryStringName] = constraint.value;
          }
        }
        if (constraint.type === 'text' ) {
          if (constraint.value) {
            param[constraint.queryStringName] = constraint.value;
          }
        }
        return param;
      };

      MlSearchObject.prototype.getStateParams = function () {
        var self = this;
        var params = {};
        if (this.criteria.q) {
          params.q = this.criteria.q;
        }
        angular.forEach(this.criteria.constraints, function (constraint) {
          mlUtil.merge(params, self.stateParamFromConstraint(constraint));
        });
        return params;
      };

      MlSearchObject.prototype.constraintFromStateParam = function (
        constraint,
        stateParams
      ) {
        var trimmed = stateParams[constraint.queryStringName] &&
            stateParams[constraint.queryStringName].trim();

        var propName = constraint.type === 'enum' ? 'values' : 'value';
        if (constraint.type === 'enum') {
          if (trimmed && trimmed.length) {
            constraint.values = trimmed.split(',');
          }
          else {
            constraint.values = null;
          }
        }
        if (constraint.type === 'boolean') {
          switch (trimmed) {
            case 'yes':
              constraint.value = true;
              break;
            case 'no':
              constraint.value = false;
              break;
            default:
              constraint.value = null;
              break;
          }
        }
        if (constraint.type === 'text') {
          constraint.value = trimmed;
        }
        if (constraint.type === 'date') {
          if (trimmed && trimmed.length) {
            constraint.value = mlUtil.moment(trimmed);
          }
          else {
            constraint.value = null;
          }
        }
      };

      MlSearchObject.prototype.assignStateParams = function (stateParams) {
        var params = {};
        var self = this;
        this.page = stateParams.page ? parseInt(stateParams.page.trim()) : null;
        this.criteria.q = stateParams.q ? stateParams.q.trim() : null;
        angular.forEach(this.criteria.constraints, function (constraint) {
          mlUtil.merge(params, self.constraintFromStateParam(
            constraint,
            stateParams
          ));
        });

        mlUtil.merge(this.criteria, { constraints : params} );
        this.testValidity();
      };


      return mlModelBase.extend('MlSearchObject', MlSearchObject);
    }
  ]);
});
