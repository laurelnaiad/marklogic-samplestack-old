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
          'ng-model="dtStartSelection" ng-click="open($event,\'startOpened\')" ' +
          'ng-change="selectDate(dtStartSelection,\'dtStartSelection\')"  ' +
              'datepicker-options="dateOptions" min-date="minDate" ' +
              'max-date="maxDate" is-open="startOpened" ' +
              'show-button-bar="false" show-weeks="false" /> ' +
          '<label for="date-to">To:</label>' +
          '<input type="text" id="date-to" ' +
          'class="form-control ng-valid-date" datepicker-popup="MM/dd/yyyy"' +
          'ng-model="dtEndSelection" ng-click="open($event,\'endOpened\')"' +
          'ng-change="selectDate(dtEndSelection,\'dtEndSelection\')"  ' +
          'datepicker-options="dateOptions" min-date="minDate" max-date="maxDate" ' +
          'is-open="endOpened" show-button-bar="false" show-weeks="false" />',

      scope: {
        // bound via data attribute to a view-scoped property. For now, draft
        // a schema here that represents all the data needed for the directive.
        data: '=dateRangeData'
      },
      compile: function compile (tElement, tAttrs, transclude) {
        var chart, chartClearSelection, chartSelectAll, convertDateToUTC;

        convertDateToUTC = function(dateToConvert, retDateObj) {
          dateToConvert         = (dateToConvert instanceof Date) ?
                                    dateToConvert : new Date(dateToConvert);
                                  // milliseconds offset from GMT/UTC
          var timeZoneOffsetMs  = dateToConvert.getTimezoneOffset() * 60 * 1000,
              convertedDateMs   = Date.UTC(dateToConvert.getUTCFullYear(),
                                            dateToConvert.getUTCMonth(),
                                            dateToConvert.getUTCDate());

          convertedDate = convertedDateMs + timeZoneOffsetMs;
          return (retDateObj) ? new Date(convertedDate) : convertedDate;
        };

        tElement.addClass('ss-facet-date-range');
        return {
          pre: function (scope, element, attrs) {
            var x;
            // determine start and end dates for data
            scope.dtDataStart = scope.dtDataEnd = convertDateToUTC(scope.data[0].x);
            for (var i = 0, l = scope.data.length; i < l; i++) {
              x = convertDateToUTC(scope.data[i].x)
              if (x < scope.dtDataStart)
                scope.dtDataStart = x;
              if (x > scope.dtDataEnd)
                scope.dtDataEnd = x;
            }
            // set inputs to match data high and low
            scope.dtStartSelection  = scope.dtDataStart;
            scope.dtEndSelection    = scope.dtDataEnd;

            chartClearSelection = function () {
              var selectedPoints = chart.getSelectedPoints(),
                  l = selectedPoints.length;
              if (l > 0) {
                for (var i = 0; i < l; i = i + 1) {
                  selectedPoints[i].select(false);
                }
              }
            };

            chartSelectAll = function () {
              /*
              var points = (chart.series[0] && chart.series[0].points) ? chart.series[0].points : undefined;
              if (points) {
                $.each(points, function (index,point) {
                    point.select(true, true);
                });
              }
              */
              // clear selection in scope
              scope.dtStartSelection = scope.dtDataStart;
              scope.dtEndSelection = scope.dtDataEnd;
            };

            chartUpdateSelection = function () {
              var points = (chart.series[0]
                              && chart.series[0].points) ?
                              chart.series[0].points : undefined;
              if (points && !(scope.dtStartSelection instanceof Date) && !(scope.dtEndSelection instanceof Date)) {
                chartClearSelection();
                $.each(points, function (index,point) {
                  // convert to UTC as original series was standard Date
                  if (convertDateToUTC(point.x) >= scope.dtStartSelection
                    && convertDateToUTC(point.x) <= scope.dtEndSelection)
                  point.select(true, true);
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
                      chart = this;
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
                        var seriesData    = self.series[0].data,
                            selSeriesLow, selSeriesHigh;

                        for (var i = 0, l = seriesData.length; i < l; i++) {
                          if (seriesData[i].x >= event.xAxis[0].min
                              && seriesData[i].x <= event.xAxis[0].max) {
                            seriesData[i].select(true, true);
                            if (selSeriesLow === undefined)
                              selSeriesLow  = selSeriesHigh = seriesData[i].x;
                            // find highest and lowest selected dates
                            if (seriesData[i].x < selSeriesLow)
                              selSeriesLow = seriesData[i].x;
                            if (seriesData[i].x > selSeriesHigh)
                              selSeriesHigh = seriesData[i].x;
                          }
                        }

                        scope.dtStartSelection   = convertDateToUTC(selSeriesLow);
                        scope.dtEndSelection     = convertDateToUTC(selSeriesHigh);
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
                    return '<strong>'+
                      Highcharts.dateFormat('%b %e, %Y', this.x) +
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
                data: scope.data
                // [
                //   {x: Date.UTC(2010, 0, 1), y: 29.9}, {x: Date.UTC(2010, 1, 1), y: 71.5},
                //   {x: Date.UTC(2010, 2, 1), y: 106.4}, {x: Date.UTC(2010, 3, 1), y: 129.2},
                //   {x: Date.UTC(2010, 4, 1), y: 144.0}, {x: Date.UTC(2010, 4, 1), y: 176.0},
                //   {x: Date.UTC(2010, 5, 1), y: 135.6}, {x: Date.UTC(2010, 6, 1), y: 148.5},
                //   {x: Date.UTC(2010, 7, 1), y: 216.4}, {x: Date.UTC(2010, 8, 1), y: 194.1},
                //   {x: Date.UTC(2010, 9, 1), y: 95.6}, {x: Date.UTC(2011, 10, 1), y: 54.4}
                // ]
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

            /* Calender Picker Setup and Management */
            scope.open = function (event,prop) {
              event.preventDefault();
              event.stopPropagation();

              scope[prop] = true;
            };

            scope.selectDate = function (event,prop) {
              // convert selection (standard Date) to UTC Date
              scope[prop] = convertDateToUTC(event);
            };

            scope.$watch('dtStartSelection', function () {
              /* convertDateToUTC(scope.dtStartSelection).getTime() */
              chartUpdateSelection();
            });

            scope.$watch('dtEndSelection', function () {
              /* convertDateToUTC(scope.dtEndSelection).getTime() */
              chartUpdateSelection();
            });

            /* Calender Picker end */
          }
        }
      }
    };
  });
});
