define(['_marklogic/module'], function (module) {

  module.factory('MlSearchSpecModel', [

    '$injector',
    'MlModel',
    'mlSchema',
    'MlSearchResultsModel',
    function (
      $injector,
      MlModel,
      mlSchema,
      MlSearchResultsModel
    ) {

      var searchService;
      var self;

      var MlSearchSpecModel = function (spec) {
        MlModel.call(this, spec);

        // avoid circular depedency
        searchService = $injector.get('mlSearch');
        self = this;
      };

      MlSearchSpecModel.prototype = MlModel.prototype;

      MlSearchSpecModel.prototype.$schema = mlSchema.addSchema({
        id: 'http://marklogic.com/#searchSpec',
        properties: {
          queryText: {
            type: 'string'
          }
        }
      });



      MlSearchSpecModel.prototype.operations = {
        'POST': {
          endpoint: '/search',
          dataOut: function () {
            return searchService.getSearchSpecOut(self.value);
          },
          expects: MlSearchResultsModel
        }
      };

      return MlSearchSpecModel;

    }
  ]);
});
