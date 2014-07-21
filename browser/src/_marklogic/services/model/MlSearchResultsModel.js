define(['_marklogic/module'], function (module) {

  module.factory('MlSearchResultsModel', [

    'MlModel', 'mlSchema',
    function (
      MlModel, mlSchema
    ) {

      var MlSearchResultsModel = function (spec) {
        MlModel.call(this, spec);
      };

      MlSearchResultsModel.prototype = MlModel.prototype;

      MlSearchResultsModel.prototype.$schema = mlSchema.addSchema({
        id: 'http://marklogic.com/#searchResults',
        properties: {
        }
      });

      return MlSearchResultsModel;

    }
  ]);
});
