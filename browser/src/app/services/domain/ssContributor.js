define(['_marklogic/module'], function (module) {

  module.factory('ssContributor', [

    'mlModel',
    function (
      mlModel
    ) {
      return mlModel.extend({
        schema: {
          id: 'http://marklogic.com/samplestack#contributor',
          required: ['id', 'reputation'],
          properties: {
            websiteUrl: { type:['string', 'null' ] },
            reputation: { type: ['integer'], minimum: 0 },
            aboutMe: { type: [ 'string', 'null'], maxLength:255 },
            // stronger requirements on id (length s/b uuid)
            id: { type: 'string', minLength: 36, maxLength: 36 },
            location: { type: [ 'string', 'null' ]},
            votes: { type: 'array', items: { type: 'string' } }
          }
        }
      });
    }
  ]);
});
