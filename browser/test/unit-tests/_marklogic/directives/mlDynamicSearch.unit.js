define(['testHelper'], function (helper) {

  return function () {
    describe('mlDsQText', function () {
      var el;
      var scope;
      var $compile;
      var $timeout;
      var element;
      var sut;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function ($rootScope, _$compile_, _$timeout_) {

            scope = $rootScope.$new();
            $compile = _$compile_;
            $timeout = _$timeout_;

            element = angular.element(
              '<div ml-dynamic-search="dsObj">' +
              '<input ml-ds-q-text/>' +
              '</div>'
            );

            $compile(element)(scope);
            // el = element[0].querySelector('.ml-ds-q-text');
            scope.$digest();
            sut = element.find('input');

            done();
          }
        );
      });

      it('it should be initialized', function () {
        scope.dsObj.query.should.have.property('qtext');
      });

      it('it should sync scope to html', function () {
        scope.dsObj.query.qtext = 'testy';
        scope.$digest();
        sut.val().should.equal('testy');
      });

      it('it should sync html to scope', function () {
        sut.val('tested').triggerHandler('change');
        scope.$digest();
        scope.dsObj.query.qtext.should.equal('tested');
      });


    });

  };
});
