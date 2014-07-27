define(['_marklogic/module'], function (module) {

  module.factory('ssSession', [

    'mlModel', 'mlSession', 'ssContributor',
    function (
      mlModel, mlSession, ssContribtor
    ) {
      var mySchema = _.clone(mlSession.Factory.$ml.spec.schema);

      return mlModel.extend({
        schema: {
          id: 'http://marklogic.com/samplestack#session',
          oneOf: [
            { $ref: 'http://marklogic.com/#sessionPrelogin' },
            {
              allOf: [
                { $ref: 'http://marklogic.com/#sessionPostlogin'},
                { $ref: 'http://marklogic.com/samplestack#contributor'}
              ]
            }
          ]
        }
      });
    }
  ]);
});
