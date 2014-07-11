define([], function () {

  return {
    schema: {
      $schema: 'http://json-schema.org/draft-04/schema#',
      id: 'http://marklogic.com/samplestack#',

    },

    model: {

      tags: {

        endPoint: '/v1/tags',
        operations: {
          'GET': {
            params: {

            }
          }

        }[
          'GET'
        ]

        schema: {
          id: '#tags',
          type: 'array',
          items: { $ref: '#tag' },
          minItems: 0
        }
      }
    }

    tag: {
      id: '#tag',
      type: 'object',
      required: [
        'name'
      ],
      properties: {
        name: { type: 'string' }
      }
    },

    tags: {
    },

    exploreResult: {

    }
  };
});
