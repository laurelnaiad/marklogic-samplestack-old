define(['testHelper'], function (helper) {

  return function () {
    describe('mlSchama', function () {
      var sut;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (mlSchema) {
            sut = mlSchema;
            done();
          }
        );
      });

      it('should do basic validation', function () {
        // $timeout.flush();
        // sut.addSchema({
        //   'id': '/SimpleAddress',
        //   'type': 'object',
        //   'properties': {
        //     'lines': {
        //       'type': 'array',
        //       'items': {'type': 'string'}
        //     },
        //     'zip': {'type': 'string'},
        //     'city': {'type': 'string'},
        //     'country': {'type': 'string', 'required': true}
        //   }
        // }, '/SimpleAddress');
        var schema = {
          'type': 'object',
          'properties': {
            'name': {
              'type': 'string'
            },
            'votes': {
              'type': 'integer',
              'minimum': 1
            }
          }
        };
        var instance = {
          'name': 'Barack Obama',
          'address': {
            'lines': [ '1600 Pennsylvania Avenue Northwest' ],
            'zip': 'DC 20500',
            'city': 'Washington',
            'country': 'USA'
          },
          'votes': 'lots'
        };
        var result = sut.validate(instance, schema);
        result.errors.length.should.equal(1);
      });

      it('should support multiple schema', function () {
        sut.addSchema({
          'id': '/SimpleAddress',
          'type': 'object',
          'properties': {
            'lines': {
              'type': 'array',
              'items': {'type': 'string'},
              required: true
            },
            'zip': {'type': 'string'},
            'city': {'type': 'string'},
            'country': {'type': 'string', 'required': true}
          }
        }, '/SimpleAddress');
        var schema = {
          'type': 'object',
          'properties': {
            'name': {
              'type': 'string'
            },
            address: { $ref: '/SimpleAddress', required: true },
            'votes': {
              'type': 'integer',
              'minimum': 1
            }
          }
        };
        var instance = {
          'name': 'Barack Obama',
          'address': {
            'zip': 'DC 20500',
            'city': 'Washington',
            'country': 'USA'
          },
          'votes': 1
        };
        var result = sut.validate(instance, schema);
        result.errors[0].property.should.equal('instance.address.lines');
      });

    });
  };

});
