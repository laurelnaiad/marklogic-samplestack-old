define(['testHelper'], function (helper) {

  return function () {
    describe('ssMarkdownEditor', function () {
      var el;
      var scope;
      var $compile;
      var $httpBackend;
      var $timeout;
      var dsElement;
      var dsScope;
      var dsIsolate;

      beforeEach(function (done) {
        angular.mock.module('app');
        inject(
          function ($rootScope, _$httpBackend_, _$compile_, _$timeout_) {

            scope         = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $compile      = _$compile_;
            $timeout      = _$timeout_;

            dsElement = angular.element(
              '<div ss-markdown-editor content="question"></div>'
            );

            scope.question = 'this is my question with `var some = code();`';

            $httpBackend.expectGET(
              '/app/images/ss-markdown-editor/md-bold.png'
            ).respond(200);

            // $httpBackend.expectGET(
            //   /^.*\.png$/
            // ).respond(200);

            $compile(dsElement)(scope);
            // $httpBackend.flush();
            scope.$apply();

            dsScope = dsElement.isolateScope();

            done();
          }
        );
      });

      it(
        'should have access to question',
          function () {
            dsScope.content.should.be.ok;
            //.should.equal('hey');
            //  dsScope.config.pageLength.should.equal(5);
          }
      );

      it(
        'should be rendering question in textarea',
          function () {
            var txtArea = dsElement.find('textarea');
            txtArea.val().should.equal(dsScope.content);
          }
      );

      it(
        'should be rendering random text',
          function () {
            var txtArea = dsElement.find('textarea');
            txtArea.val().should.not.equal('TEST');
          }
      );

    });

  };
});
