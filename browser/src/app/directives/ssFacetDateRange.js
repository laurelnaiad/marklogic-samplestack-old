define(['app/module'], function (module) {
  // parrent directive for coordination of dynamic search features
  module.directive('ssFacetDateRange', function () {
    return {
      restrict: 'A',
      // replace: true,
      // higchart is embedded, this is subject to change as to how to get
      // the chart loaded. Much of the work here will be in driving highchart
      // bindings from data
      template: '<highchart config="highchartsConfig"></highchart>' +
          '<label for="date-from">From:</label>' +
          '<input type="text" id="date-from" ' +
          'class="form-control ng-valid-date" datepicker-popup="MM/dd/yyyy" ' +
          'ng-model="dtStartSelection" ' +
          'ng-click="open($event,\'startOpened\')" ' +
          'ng-change="selectDate(dtStartSelection,\'dtStartSelection\')"  ' +
              'datepicker-options="dateOptions" min-date="minDate" ' +
              'max-date="maxDate" is-open="startOpened" ' +
              'show-button-bar="false" show-weeks="false" /> ' +
          '<label for="date-to">To:</label>' +
          '<input type="text" id="date-to" ' +
          'class="form-control ng-valid-date" datepicker-popup="MM/dd/yyyy"' +
          'ng-model="dtEndSelection" ng-click="open($event,\'endOpened\')"' +
          'ng-change="selectDate(dtEndSelection,\'dtEndSelection\')"  ' +
          'datepicker-options="dateOptions" min-date="minDate" ' +
          'max-date="maxDate" ' +
          'is-open="endOpened" show-button-bar="false" show-weeks="false" />',

      scope: '=',
      compile: function compile (tElement, tAttrs, transclude) {
        var chart;
        var chartClearSelection;
        var chartUpdateSelection;
        var chartSelectAll;
        var convertDateToUTC;

       /*
        * Utility funct to convert standard Date() object to UTC for HighCharts
        * @param {object} [dateToConvert] - as Date obj or Date().getTime() ms
        * @param {boolean} [retDateObj] - set return type as Date() or ms
        * @returns {Number}
        */
        convertDateToUTC = function (dateToConvert, retDateObj) {
          dateToConvert = (dateToConvert instanceof Date) ?
              dateToConvert :
              new Date(dateToConvert);

          // milliseconds offset from GMT/UTC
          var timeZoneOffsetMs = dateToConvert.getTimezoneOffset() * 60 * 1000;
          var convertedDateMs = Date.UTC(
            dateToConvert.getUTCFullYear(),
            dateToConvert.getUTCMonth(),
            dateToConvert.getUTCDate()
          );

          var convertedDate = convertedDateMs + timeZoneOffsetMs;
          return (retDateObj) ? new Date(convertedDate) : convertedDate;
        };

        tElement.addClass('ss-facet-date-range');
        return {
          pre: function (scope, element, attrs) {
            var x;
            var i;
            var dataLength = scope.dateData.length;
            // determine start and end dates for data
            scope.dtDataStart =
                scope.dtDataEnd = convertDateToUTC(scope.dateData[0].x);

            for (i = 0; i < dataLength; i++) {
              x = convertDateToUTC(scope.dateData[i].x);
              if (x < scope.dtDataStart) {
                scope.dtDataStart = x;
              }
              if (x > scope.dtDataEnd) {
                scope.dtDataEnd = x;
              }
            }
            // set inputs to match data high and low
            scope.dtStartSelection  = scope.dtDataStart;
            scope.dtEndSelection    = scope.dtDataEnd;

           /*
            * Resets chart selection to select all points
            */
            chartClearSelection = function () {
              var selectedPoints = chart.getSelectedPoints();
              var pointsLength = selectedPoints.length;
              if (pointsLength > 0) {
                for (var i = 0; i < pointsLength; i = i + 1) {
                  selectedPoints[i].select(false);
                }
              }
            };

           /*
            * Changes selection to range of date,
            * watch on start/end triggers chartUpdateSelection()
            */
            chartSelectAll = function () {
              scope.dtStartSelection = scope.dtDataStart;
              scope.dtEndSelection = scope.dtDataEnd;
            };

           /*
            * Updates chart to match the currently selected range
            */
            chartUpdateSelection = function () {
              var points = (chart.series[0] && chart.series[0].points) ?
                  chart.series[0].points :
                  undefined;
              if (points &&
                  !(scope.dtStartSelection instanceof Date) &&
                  !(scope.dtEndSelection instanceof Date)
              ) {
                chartClearSelection();
                angular.forEach(points, function (point, index) {
                  // convert to UTC as original series was standard Date
                  if (convertDateToUTC(point.x) >= scope.dtStartSelection &&
                      convertDateToUTC(point.x) <= scope.dtEndSelection
                  ) {
                    point.select(true, true);
                  }
                });
              }
            };

            scope.highchartsConfig = {
              options: {
                chart: {
                  type: 'column',
                  zoomType: 'x',
                  events: {
                    load: function (event) {
                      // this is a workaround
                      //
                      // the closre on chart feels strange
                      var self = this;
                      chart = self;
                    },
                    redraw: function () {
                      chartUpdateSelection();
                    },
                    click: function (event) {
                      // call scope apply so any changes to data model will be
                      // triggered with scope.$digest() after this executes
                      var self = this;
                      scope.$apply(function () {
                        chartSelectAll();
                      });
                    },
                    selection: function (event) {
                      // call scope apply so any changes to data model will be
                      // triggered with scope.$digest() after this executes
                      var self = this;
                      scope.$apply(function () {
                        chartClearSelection();
                        var seriesData = self.series[0].data;
                        var selSeriesLow;
                        var selSeriesHigh;

                        for (var i = 0, l = seriesData.length; i < l; i++) {
                          if (seriesData[i].x >= event.xAxis[0].min
                              && seriesData[i].x <= event.xAxis[0].max) {
                            seriesData[i].select(true, true);
                            if (selSeriesLow === undefined) {
                              selSeriesLow  = selSeriesHigh = seriesData[i].x;
                            }
                            // find highest and lowest selected dates
                            if (seriesData[i].x < selSeriesLow) {
                              selSeriesLow = seriesData[i].x;
                            }
                            if (seriesData[i].x > selSeriesHigh) {
                              selSeriesHigh = seriesData[i].x;
                            }
                          }
                        }

                        scope.dtStartSelection = convertDateToUTC(selSeriesLow);
                        scope.dtEndSelection = convertDateToUTC(selSeriesHigh);
                      });
                      event.preventDefault();  // stop zoom from happening
                    }
                  }
                },

                legend: {
                  enabled: false
                },

                xAxis: {
                  type: 'datetime',
                  title: {
                    text: null
                  }
                },

                yAxis: {
                  min: 0,
                  title: {
                    text: null
                  },
                  labels: {
                    enabled: false
                  }
                },

                tooltip: {
                  formatter: function () {
                    var formattedDate;

                    // TODO: do not introduce dependency on globally scoped
                    // Highcharts
                    /* jshint ignore:start */
                    formattedDate = Highcharts.dateFormat(
                      '%b %e, %Y', this.x
                    );
                    /* jshint ignore:end */
                    return '<strong>' +
                        formattedDate +
                        '</strong>' + ': ' + this.y;
                  }
                },

                plotOptions: {
                  series: {
                    color: '#DBEDFA',
                    states: {
                      select: {
                        color: '#70B8ED'
                      }
                    },
                    marker: {
                      enabled: true,
                      states: {
                        select: {
                          enabled: true
                        }
                      }
                    },
                    allowPointSelect: true,
                    point: {
                      events: {
                        click: function (event) {
                          // call scope apply so any changes to data model will
                          // be triggered with scope.$digest() after this
                          // executes
                          var self = this;
                          scope.$apply(function () {
                            scope.dtStartSelection   = self.x;
                            scope.dtEndSelection     = self.x;
                          });
                        }
                      }
                    }
                  },
                  column: {
                    animation: false,
                    groupPadding: 0,
                    pointPadding: 0,
                    borderWidth: 0
                  }
                }
              },

              title: {
                text: null
              },

              subtitle: {
                text: null
              },

              series: [{
                data: scope.dateData
              }]
            };
          },
          post: function (scope, element, attrs) {

            // Date Picker Settings
            scope.minDate = scope.dtDataStart;
            scope.maxDate = scope.dtDataEnd;

            scope.dateOptions = {
              formatYear: 'yy',
              startingDay: 1
            };

            // Calender Picker Setup and Management

           /*
            * Opens Calendar by ng-click event on directive input fields
            * @param {object} [event] - click event
            * @param {string} [prop] - the property bound to the input calendar
            * state being open or not.  On being set TRUE it opens.
            */
            scope.open = function (event,prop) {
              event.preventDefault();
              event.stopPropagation();

              scope[prop] = true;
            };

           /*
            * Calendar Picker ng-change event on directive.  Convert selection
            * (standard Date) to UTC Date
            * @param {object} [event] - change event
            * @param {string} [prop] - the property bound to the input calendar
            * dtStartSelection or dtEndSelection, depending on wiring
            */
            scope.selectDate = function (event,prop) {
              scope[prop] = convertDateToUTC(event);
            };

            scope.$watch('dtStartSelection', function () {
              chartUpdateSelection();
            });

            scope.$watch('dtEndSelection', function () {
              chartUpdateSelection();
            });
            // Calender Picker end

            // Expose functions to $parent scope
            scope.$parent.dateScope = {};
            scope.$parent.dateScope.clearSelection = chartSelectAll;
          }
        };
      }
    };
  });
});
