define(['_marklogic/module'], function (module) {

  module.factory('SsContributorModel', [

    'MlUserModel', 'mlSchema',
    function (
      MlUserModel, mlSchema
    ) {

      var SsContributorModel = function (spec) {
        MlUserModel.call(this, spec);
      };

      SsContributorModel.prototype = MlUserModel.prototype;

      SsContributorModel.prototype.$schema = mlSchema.addSchema({
        id: 'http://marklogic.com/samplestack/#contributor',
        type: 'object',
        allOf: [
          { $ref: 'http://marklogic.com/#user' },
          {
            required: [
              'role', 'id', 'reputation'
            ],
            properties: {
              websiteUrl: { type:['string', 'null' ] },
              reputation: { type: ['integer'], minimum: 0 },
              aboutMe: { type: [ 'string', 'null'], maxLength:255 },
              id: { type: 'string', minLength: 36, maxLength: 36 },
              location: { type: [ 'string', 'null' ]},
              // TODO specify schema inside
              votes: { type: 'array', items: { type: 'string' } },
              role: { type: 'array', items: { type: 'string' } }
            }
          }
        ]
      });

      return SsContributorModel;

    }
  ]);
});
