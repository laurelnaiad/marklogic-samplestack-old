define(['_marklogic/module'], function (module) {
  // parrent directive for coordination of dynamic search features
  module.directive('mlDynamicSearch', function () {
    return {
      restrict: 'A',
      compile: function compile (tElement, tAttrs, transclude) {
        tElement.addClass('ml-dynamic-search');
        return {};
      },
      scope: {
        dynamicSearch: '=mlDynamicSearch'
      },
      controller: function ($scope) {
        $scope.dynamicSearch = {
          query: {
            text: null

          }
        };
        this.scope = $scope;
      }
    };
  });

  // allows generic two-way binding with a property of dynamic search
  // for the most part, we will provide custom directives where we can be
  // more helpful and they seem to be generally useful
  module.directive('mlDsBind', function () {
    return {
      restrict: 'A',
      require: '^mlDynamicSearch',
      scope: {
        mlDsBind: '@',
        mlDsValue: '='
      },
      link: function (scope, element, attrs, dsCtlr) {
        scope.$watch('mlDsValue', function (val) {
          dsCtlr.scope.dynamicSearch[scope.mlDsBind] = val;
        });
        dsCtlr.scope.$watch('dynamicSearch.' + scope.mlDsBind, function (val) {
          scope.mlDsValue = val;
        });
      }
    };
  });

  module.directive('mlDsQText', [

    '$timeout',
    function ($timeout) {
      return {
        restrict: 'A',
        require: '^mlDynamicSearch',
        compile: function (tElement, tAttrs, transclude) {
          tElement.addClass('ml-ds-q-text');
          tElement.attr('type', 'text');
          return function (scope, element, attrs, dsCtlr) {
            dsCtlr.scope.$watch('dynamicSearch.query.text', function (val) {
              element[0].value = val;
            });
            var setVal = function (evt) {
              dsCtlr.scope.dynamicSearch.query.text = element.val();//ue;
            };
            element.bind('change keyup', function (evt) {
              setVal(evt);
            });
            element.bind('paste', function (evt) {
              $timeout(function () { setVal(evt); }, 0);
            });
          };
        },
        scope: {
          //TODO -- not sure we actually want to make this an optio -- it would
          //allow app dev to override the model schema, and its not clear that
          //that has any value aside from letting people get themselves into
          //trouble.
          mlDsBind: '=?'
        }
      };
    }
  ]);

});
