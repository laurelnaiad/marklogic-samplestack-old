define(['testHelper'], function (helper) {

  return function () {
    describe('mlSearchParams', function () {
      var sut;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function (mlSearchParams) {
            sut = mlSearchParams;
            done();
          }
        );
      });

      it('it should be creatable', function () {
        var inst = sut.create({
          query: {
            qtext: 'yes'
          }
        });

        inst.query.qtext.should.equal('yes');
        inst.validate().errors.length.should.equal(0);
      });

      it('it should find errors', function () {
        var inst = sut.create({
          query: {
            qtext: ['yes']
          }
        });

        inst.validate().errors[0].property.should.equal('instance.query.qtext');

      });
    });
  };

});
