define([
  'testHelper',
  'json!mocks/searchResult1.json'
], function (helper, searchResult) {

  return function () {
    describe('mlSearch', function () {
      var $httpBackend;
      var mlSearch;
      var mlUtil;

      beforeEach(function (done) {
        angular.mock.module('_marklogic');
        inject(
          function (_$httpBackend_, _mlSearch_, _mlUtil_) {
            $httpBackend = _$httpBackend_;
            mlSearch = _mlSearch_;
            mlUtil = _mlUtil_;
            done();
          }
        );
      });

      it('should be valid for a simple a text query', function () {
        var s = mlSearch.create({
          criteria: { q: 'testy' }
        });
        s.$ml.valid.should.be.true;
      });

      it('should POST a text-only query', function (done) {
        helper.setExpectCsrf($httpBackend);
        $httpBackend.expectPOST(/\/v1\/search$/).respond(200, searchResult );

        var s = mlSearch.post({
          criteria: { q: 'testy' }
        });
        s.$ml.waiting.then(
          function () {
            s.results.should.be.ok;
            s.$ml.valid.should.be.true;
            done();
          },
          function (reason) { assert(false, JSON.stringify(reason)); done(); }
        );

        $httpBackend.flush();
      });

      it(
        'should POST a query without a criterion if value is not truthy',
        function (done) {
          helper.setExpectCsrf($httpBackend);
          $httpBackend.expectPOST(
            /\/v1\/search$/,
            {
              query: {
                qtext: 'testy'
              }
            }
          ).respond(200, searchResult );

          var s = mlSearch.post({
            criteria: {
              q: 'testy',
              constraints: {
                dummy: {
                  queryStringName: 'dummy',
                  constraintName: 'dummy',
                  type: 'text'
                }
              }
            }
          });
          s.$ml.waiting.then(
            function () {
              s.results.should.be.ok;
              s.$ml.valid.should.be.true;
              done();
            },
            function (reason) { assert(false, JSON.stringify(reason)); done(); }
          );

          $httpBackend.flush();
        }
      );

      it('should POST a query with a text constraint', function (done) {
        helper.setExpectCsrf($httpBackend);
        $httpBackend.expectPOST(
          /\/v1\/search$/,
          {
            query: {
              qtext: 'testy',
              'and-query': { queries: [
                { 'range-constraint-query' : {
                  'constraint-name': 'dummy',
                  text: 'testy'
                } }
              ] }
            }
          }
        ).respond(200, searchResult );

        var s = mlSearch.post({
          criteria: {
            q: 'testy',
            constraints: {
              dummy: {
                constraintName: 'dummy',
                queryStringName: 'dummy',
                type: 'text',
                value: 'testy'
              }
            }
          }
        });
        s.$ml.waiting.then(
          function () {
            s.results.should.be.ok;
            s.$ml.valid.should.be.true;
            done();
          },
          function (reason) { assert(false, JSON.stringify(reason)); done(); }
        );

        $httpBackend.flush();
      });

      it(
        'should POST a query with no text constraint and still have "q"',
        function (done) {
          helper.setExpectCsrf($httpBackend);
          $httpBackend.expectPOST(
            /\/v1\/search$/,
            {
              query: {
                qtext: ''
              }
            }
          ).respond(200, searchResult );

          var s = mlSearch.post({
            criteria: {
            }
          });
          s.$ml.waiting.then(
            function () {
              s.results.should.be.ok;
              s.$ml.valid.should.be.true;
              done();
            },
            function (reason) { assert(false, JSON.stringify(reason)); done(); }
          );

          $httpBackend.flush();
        }
      );

      it('should POST a query with an enum constraint', function (done) {
        helper.setExpectCsrf($httpBackend);
        $httpBackend.expectPOST(
          /\/v1\/search$/,
          {
            query: {
              qtext: 'testy',
              'and-query': { queries: [
                { 'range-constraint-query' : {
                  'constraint-name': 'dummy',
                  text: 'test1'
                } },
                { 'range-constraint-query' : {
                  'constraint-name': 'dummy',
                  text: 'test2'
                } },
              ] }
            }
          }
        ).respond(200, searchResult );

        var s = mlSearch.post({
          criteria: {
            q: 'testy',
            constraints: {
              dummy: {
                queryStringName: 'dummy',
                constraintName: 'dummy',
                type: 'enum',
                subType: 'text',
                values: ['test1', 'test2']
              }
            }
          }
        });
        s.$ml.waiting.then(
          function () {
            s.results.should.be.ok;
            s.$ml.valid.should.be.true;
            done();
          },
          function (reason) { assert(false, JSON.stringify(reason)); done(); }
        );

        $httpBackend.flush();
      });

      it('should POST a query with a date constraint', function (done) {
        helper.setExpectCsrf($httpBackend);
        $httpBackend.expectPOST(
          /\/v1\/search$/,
          {
            query: {
              qtext: 'testy',
              'and-query': { queries: [
                { 'range-constraint-query' : {
                  'constraint-name': 'dummy',
                  value: '2001-01-01'
                } }
              ] }
            }
          }
        ).respond(200, searchResult );

        var s = mlSearch.post({
          criteria: {
            q: 'testy',
            constraints: {
              dummy: {
                constraintName: 'dummy',
                queryStringName: 'dummy',
                type: 'date',
                value: mlUtil.moment('2001-01-01')
              }
            }
          }
        });
        s.$ml.waiting.then(
          function () {
            s.results.should.be.ok;
            s.$ml.valid.should.be.true;
            done();
          },
          function (reason) { assert(false, JSON.stringify(reason)); done(); }
        );

        $httpBackend.flush();
      });

      it('should POST a query with a boolean constraint', function (done) {
        helper.setExpectCsrf($httpBackend);
        $httpBackend.expectPOST(
          /\/v1\/search$/,
          {
            query: {
              qtext: 'testy',
              'and-query': { queries: [
                { 'range-constraint-query' : {
                  'constraint-name': 'dummy',
                  value: true
                } }
              ] }
            }
          }
        ).respond(200, searchResult );

        var s = mlSearch.post({
          criteria: {
            q: 'testy',
            constraints: {
              dummy: {
                constraintName: 'dummy',
                queryStringName: 'dummy',
                type: 'boolean',
                value: true
              }
            }
          }
        });
        s.$ml.waiting.then(
          function () {
            s.results.should.be.ok;
            s.$ml.valid.should.be.true;
            done();
          },
          function (reason) { assert(false, JSON.stringify(reason)); done(); }
        );

        $httpBackend.flush();
      });

      it('should produce empty stateParams with no criteria', function () {
        var s = mlSearch.create();
        s.getStateParams().should.deep.equal({});
      });

      it('should produce empty stateParams with empty criteria', function () {
        var s = mlSearch.create({ criteria: {} });
        s.getStateParams().should.deep.equal({});
      });


      it('should produce stateParams with q', function () {
        var s = mlSearch.create({ criteria: { q: 'test' } });
        s.getStateParams().should.have.property('q', 'test');
      });

      it('should produce stateParams with a date', function () {
        var s = mlSearch.create({ criteria: {
          constraints: {
            dummy: {
              queryStringName: 'test-name',
              type: 'date',
              value: mlUtil.moment('2001-01-01')
            }
          }
        } });
        s.getStateParams().should.have.property('test-name', '2001-01-01');
      });

      it('should produce stateParams with an enum', function () {
        var s = mlSearch.create({ criteria: {
          constraints: {
            dummy: {
              queryStringName: 'test-name',
              type: 'enum',
              subType: 'string',
              values: ['1', '2']
            }
          }
        } });
        s.getStateParams().should.have.property('test-name', '1,2');
      });

      it('should produce stateParams with an empty enum', function () {
        var s = mlSearch.create({ criteria: {
          constraints: {
            dummy: {
              queryStringName: 'test-name',
              type: 'enum',
              subType: 'string',
              values: []
            }
          }
        } });
        s.getStateParams().should.deep.equal({});
      });

      it('should produce stateParams with no enum', function () {
        var s = mlSearch.create({ criteria: {
          constraints: {
            dummy: {
              queryStringName: 'test-name',
              type: 'enum',
              subType: 'string'
            }
          }
        } });
        s.getStateParams().should.deep.equal({});
      });

      it('should produce stateParams without a date', function () {
        var s = mlSearch.create({ criteria: {
          constraints: {
            dummy: {
              queryStringName: 'test-name',
              type: 'date'
            }
          }
        } });
        s.getStateParams().should.deep.equal({});
      });

      it('should produce stateParams with a boolean', function () {
        var s = mlSearch.create({ criteria: {
          constraints: {
            dummy: {
              queryStringName: 'test-name',
              type: 'boolean',
              value: true
            }
          }
        } });
        s.getStateParams().should.have.property('test-name', true);
      });

      it('should produce stateParams without a boolean', function () {
        var s = mlSearch.create({ criteria: {
          constraints: {
            dummy: {
              queryStringName: 'test-name',
              type: 'boolean'
            }
          }
        } });
        s.getStateParams().should.deep.equal({});
      });

      it('should produce stateParams with a text', function () {
        var s = mlSearch.create({ criteria: {
          constraints: {
            dummy: {
              queryStringName: 'test-name',
              type: 'text',
              value: 'dummy'
            }
          }
        } });
        s.getStateParams().should.have.property('test-name', 'dummy');
      });

      it('should produce stateParams without a text', function () {
        var s = mlSearch.create({ criteria: {
          constraints: {
            dummy: {
              queryStringName: 'test-name',
              type: 'text'
            }
          }
        } });
        s.getStateParams().should.deep.equal({});
      });

      it('should take a set of stateParams and assign them', function () {
        var s = mlSearch.create({
          criteria: { constraints: {
            a: { type: 'boolean', queryStringName: 'a' },
            b: { type: 'text', queryStringName: 'b'  },
            c: { type: 'enum', subType: 'string', queryStringName: 'c'  },
            d: { type: 'date', queryStringName: 'd'  }
          }}
        });

        s.assignStateParams({
          a: 'true',
          b: 'test',
          c: '1,2',
          d: '2001-01-01',
          q: 'stuff',
          page: '1'
        });

        s.criteria.q.should.equal('stuff');
        s.page.should.equal(1);
        s.criteria.constraints.should.deep.equal({
          a: { type: 'boolean', queryStringName: 'a', value: true },
          b: { type: 'text', queryStringName: 'b', value: 'test' },
          c: {
            type: 'enum',
            subType: 'string',
            queryStringName: 'c',
            values: ['1', '2']
          },
          d: {
            type: 'date',
            queryStringName: 'd',
            value: mlUtil.moment('2001-01-01')
          }
        });
      });


      it('should throw for unsupported methods', function () {
        try {
          var s = mlSearch.getOne({
            id: 1
          });
        }
        catch (err) {
          assert(true);
          return;
        }
        assert(false, 'expected error');
      });
    });

  };

});
