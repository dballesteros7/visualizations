var dateseries = angular.module('dateseries', ['templates-dateseries']);

/**
 * Filter function that outputs the points that are visible in the viewport
 * given by the xScale d3.scale object. It returns objects with appropriate
 * coordinates after the conversion done by the xScale and yScale objects.
 */
dateseries.filter('pointsFilter', function(){
  return function(input, xScale, yScale){
    var newInput = input.filter(
        function(val){
          return xScale.domain()[0] <= val.datetime
              && xScale.domain()[1] >= val.datetime;
        }).map(function(val){
      return {
        x : xScale(val.datetime),
        y : yScale(val.value),
        original : val
      };
    });
    return newInput;
  };
});

/**
 * Date series directive. This displays a line plot based on dates in the x axis
 * and positive values on the y axis.
 * The required attributes for this element are:
 *  id : Unique id for the element.
 *  width: Width in pixels for the chart.
 *  height: Height in pixels for the chart.
 *  units: Units of the data on the Y-axis.
 *  axis-x-title: Title of the X axis.
 *  y-title: Title of the Y axis.
 *  data: Data array to display, this should be an array of Objects with
 *  the following structure: {datetime : <Date object>, value : <Float>}.
 */
dateseries.directive('dateSeries',
    [
        '$filter',
        function($filter){

          /**
           * Initialize the dimensions for the widget and include in the scope
           * variable
           */
          function initializeDimensions(scope){
            scope.width = parseFloat(scope.width);
            scope.height = parseFloat(scope.height);
            // TODO: Check that the space is sufficient
            scope.xAxisTitleHeight = 20;
            scope.yAxisTitleWidth = 30;
            scope.xAxisHeight = 25;
            scope.yAxisWidth = 50;
            scope.margins = {
              bottom : scope.xAxisTitleHeight + scope.xAxisHeight,
              top : 30,
              right : 30,
              left : scope.yAxisTitleWidth + scope.yAxisWidth
            };
            scope.contentHeight = scope.height - scope.margins.bottom;
            scope.contentHeight -= scope.margins.top + scope.xAxisHeight;
            scope.contextHeight = 0.4 * scope.contentHeight;
            scope.focusHeight = 0.6 * scope.contentHeight;
            scope.contentWidth = scope.width - scope.margins.left
                - scope.margins.right;
            scope.contextTop = scope.margins.top + scope.focusHeight;
            scope.contextTop += scope.xAxisHeight;
          }

          /**
           * Initialize all the required D3 objects.
           */
          function initializeD3Helpers(scope, element){
            scope.d3Element = d3.select(element[0]);
            scope.xScale = d3.time.scale().range([ 0, scope.contentWidth ]);
            scope.xBrushScale = d3.time.scale()
                .range([ 0, scope.contentWidth ]);
            scope.yFocusScale = d3.scale.linear().range(
                [ scope.focusHeight, 0 ]);
            scope.yContextScale = d3.scale.linear().range(
                [ scope.contextHeight, 0 ]);

            scope.xAxis = d3.svg.axis().scale(scope.xScale).orient('bottom')
                .ticks(5).outerTickSize(2).innerTickSize(10);
            scope.yFocusAxis = d3.svg.axis().scale(scope.yFocusScale).orient(
                'left').ticks(5).outerTickSize(2).innerTickSize(10);

            scope.focusLineGen = d3.svg.line().interpolate('cardinal').x(
                function(d){
                  return scope.xScale(d.datetime);
                }).y(function(d){
              return scope.yFocusScale(d.value);
            });

            scope.contextAreaGen = d3.svg.area().interpolate('cardinal').x(
                function(d){
                  return scope.xScale(d.datetime);
                }).y0(scope.contextHeight).y1(function(d){
              return scope.yContextScale(d.value);
            });

            scope.symbolGen = d3.svg.symbol().size(32);

            scope.brushGen = d3.svg.brush().x(scope.xBrushScale).on(
                'brush',
                function(){
                  scope.xScale
                      .domain(scope.brushGen.empty() ? scope.xBrushScale
                          .domain() : scope.brushGen.extent());
                  scope.d3Element.select(
                      '.date-series-x.date-series-axis.date-series-focus')
                      .call(scope.xAxis);
                  scope.dataLinePath = scope.focusLineGen(scope.data);
                  scope.dataPoints = $filter('pointsFilter')(scope.data,
                      scope.xScale, scope.yFocusScale);
                  scope.$apply();
                });
          }

          /**
           * Main update function, this updates the plot when the input data
           * changes.
           */
          function watchData(newData, oldData, scope){
            if (newData) {
              scope.xScale.domain(d3.extent(newData.map(function(d){
                return d.datetime;
              })));
              scope.yFocusScale.domain([ 0, d3.max(newData.map(function(d){
                return d.value;
              })) + 10 ]);
              scope.xBrushScale.domain(scope.xScale.domain());
              scope.yContextScale.domain(scope.yFocusScale.domain());
              scope.d3Element.select(
                  '.date-series-x.date-series-axis.date-series-focus').call(
                  scope.xAxis);
              scope.d3Element.select(
                  '.date-series-x.date-series-axis.date-series-context').call(
                  scope.xAxis);
              scope.d3Element.select('.date-series-y.date-series-axis').call(
                  scope.yFocusAxis);
              scope.dataLinePath = scope.focusLineGen(newData);
              scope.dataAreaPath = scope.contextAreaGen(newData);
              scope.dataPoints = $filter('pointsFilter')(newData, scope.xScale,
                  scope.yFocusScale);
              scope.d3Element.select(".date-series-x.date-series-brush").call(
                  scope.brushGen).selectAll("rect").attr("height",
                  scope.contextHeight).style("fill-opacity", ".125");
            }
          }

          /**
           * Function that returns a scope-aware function that displays a
           * tooltip with the value of the point that triggered the mouseenter
           * event.
           */
          function showTooltip(scope){
            return function(element){
              scope.tooltip.show = true;
              scope.tooltip.x = element.x;
              scope.tooltip.y = element.y - 5;
              scope.tooltip.value = '' + element.original.value + ' '
                  + scope.units;
            };
          }

          /**
           * Function that returns a scope-aware function that hides the current
           * tooltip, if any is present.
           */
          function hideTooltip(scope){
            return function(){
              scope.tooltip.show = false;
            };
          }

          /**
           * Link function for the directive, it initializes all required
           * variables and register the watcher for the data.
           */
          function link(scope, element, attrs){
            scope.dataLinePath = 'M0,0';
            scope.dataAreaPath = 'M0,0';
            scope.tooltip = {
              show : false
            };
            initializeDimensions(scope);
            initializeD3Helpers(scope, element);
            scope.$watch('data', watchData);
            scope.$watchCollection('data', watchData);
            scope.showTooltip = showTooltip(scope);
            scope.hideTooltip = hideTooltip(scope);
          }
          return {
            restrict : 'E',
            templateUrl : 'templates/dateseries.tpl.html',
            scope : {
              data : '=',
              id : '@',
              width : '@',
              height : '@',
              units : '@',
              yTitle : '@',
              xTitle : '@axisXTitle',
            },
            link : link
          };
        } ]);