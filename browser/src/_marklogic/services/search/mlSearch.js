define(['_marklogic/module'], function (module) {
  module.provider('mlSearch', [

    function (
    ) {

      this.facetDefinitions = [];

      this.$get = [
        'mlHttpAdapter',
        function (
          mlHttpAdapter
        ) {

          // instantiate facet defintions
          var facetDefinitions = {};
          angular.forEach(this.facetDefinitions, function (facet) {

          });

          return {
            getSearchSpecOut: function (searchSpec) {
              return {
                qtext: searchSpec.queryText ?
                    searchSpec.queryText :
                    null
              };
            },

            searchOne: function (searchSpec) {
              return mlHttpAdapter.post(searchSpec);
            }
          };
        }

      ];

    }
  ]);
});
