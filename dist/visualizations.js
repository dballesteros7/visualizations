angular.module('templates-dateseries', ['templates/dateseries.tpl.html']);

angular.module("templates/dateseries.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/dateseries.tpl.html",
    "<svg class=\"date-series-viewport\" ng-attr-width=\"{{width}}\" ng-attr-height=\"{{height}}\"><defs><clippath id=\"clip-{{id}}\"><rect ng-attr-width=\"{{contentWidth}}\" ng-attr-height=\"{{focusHeight}}\"></rect></clippath></defs><g class=\"date-series-focus\" ng-attr-transform=\"translate({{margins.left}}, {{margins.top}})\"><path class=\"date-series-focus-line\" clip-path=\"url(#clip-{{id}})\" ng-attr-d=\"{{dataLinePath}}\"></path><g class=\"date-series-x date-series-axis date-series-focus\" ng-attr-transform=\"translate(0, {{focusHeight}})\"></g><g class=\"date-series-y date-series-axis\"></g><g class=\"date-series-points\"><path ng-repeat=\"point in dataPoints\" ng-attr-transform=\"translate({{point.x}}, {{point.y}})\" ng-attr-d=\"{{symbolGen()}}\" class=\"date-series-point\" ng-mouseenter=\"showTooltip(point)\" ng-mouseleave=\"hideTooltip()\" ng-click=\"clickFunction({point : point})\"></path><text class=\"date-series-tooltip\" ng-attr-transform=\"translate({{tooltip.x}}, {{tooltip.y}})\" ng-show=\"tooltip.show\">{{tooltip.value}}</text></g></g><g class=\"date-series-context\" ng-attr-transform=\"translate({{margins.left}}, {{contextTop}})\"><path class=\"date-series-context-area\" ng-attr-d=\"{{dataAreaPath}}\"></path><g class=\"date-series-x date-series-axis date-series-context\" ng-attr-transform=\"translate(0, {{contextHeight}})\"></g><g class=\"date-series-x date-series-brush\"></g></g><g class=\"date-series-axis-titles\"><text ng-attr-transform=\"translate(30, {{margins.top + focusHeight/2}}) rotate(-90)\">{{yTitle}}</text><text ng-attr-transform=\"translate({{contentWidth/2 + margins.left}}, {{height}})\">{{xTitle}}</text></g></svg>");
}]);

angular.module('templates-sleepcycle', ['templates/sleepcycle.tpl.html']);

angular.module("templates/sleepcycle.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sleepcycle.tpl.html",
    "<svg ng-mousemove=\"movement($event)\" ng-attr-width=\"{{width}}\" ng-attr-height=\"{{height}}\"><defs><lineargradient id=\"sun-grad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\"><stop offset=\"0%\" style=\"stop-color:#FF8034;stop-opacity:1\"><stop offset=\"100%\" style=\"stop-color:#FFC02D;stop-opacity:1\"></lineargradient></defs><g><path class=\"clock\" ng-attr-d=\"{{clockPath}}\" ng-attr-transform=\"translate({{center}}, {{center}})\"></path><path class=\"tick\" ng-repeat=\"tick in ticks\" d=\"M0 0L0 10\" ng-attr-transform=\"translate({{center}}, {{center}}) rotate({{tick.angle}}) translate(0, {{clock.outerRadius -10}})\"></path><text class=\"tick-text\" ng-repeat=\"tick in ticks | clockticks\" ng-attr-transform=\"translate({{center}}, {{center}})\n" +
    "                       rotate({{tick.angle}})\n" +
    "                       translate(0, {{clock.outerRadius -15}})\" text-anchor=\"middle\">{{tick.text}}</text><path class=\"outer-shell\" ng-attr-d=\"{{outerArcPath}}\" ng-attr-transform=\"translate({{center}}, {{center}})\" ng-mouseover=\"mouseoverEvent(null)\"></path><path ng-attr-d=\"{{clockHandPath}}\" class=\"clock-hand\" ng-attr-transform=\"translate({{center}}, {{center}}) rotate({{clockHandAngle}})\n" +
    "    translate(0, {{clock.outerRadius}})\"></path><path ng-repeat=\"event in sleepEvents\" ng-attr-transform=\"translate({{center}}, {{center}})\" ng-attr-d=\"{{event.path}}\" ng-class=\"event.colorClass\" class=\"sleep-event\" ng-mouseover=\"mouseoverEvent(event)\"></path><text class=\"center-text\" ng-attr-transform=\"translate({{center}}, {{center}})\" text-anchor=\"middle\">{{eventText}}</text><path ng-attr-d=\"{{sunPath}}\" ng-attr-transform=\"translate({{center}}, {{center}})\" class=\"sun-border\" ng-class=\"sunClass\"></path><text class=\"center-text\" ng-attr-transform=\"translate({{center}}, {{center + 30}})\" text-anchor=\"middle\" ng-style=\"qualityStyle\">{{qualityText}}</text><text class=\"current-hour-text\" text-anchor=\"middle\" ng-attr-transform=\"translate({{center}}, {{height}})\" ng-bind=\"currentDate\"></text></g></svg>");
}]);

angular.module('templates-weightscale', ['templates/weightscale.tpl.html']);

angular.module("templates/weightscale.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/weightscale.tpl.html",
    "<svg ng-attr-width=\"{{dimensions.width}}\" ng-attr-height=\"{{dimensions.height}}\"><g class=\"weightscale-viewport\" ng-attr-transform=\"translate({{margins.left}}, {{margins.top}})\"><rect ng-repeat=\"bmiZone in bmiZones\" ng-attr-x=\"{{bmiZone.x}}\" ng-attr-y=\"{{bmiZone.y}}\" ng-attr-width=\"{{bmiZone.width}}\" ng-attr-height=\"{{bmiZone.height}}\" class=\"weightscale-bmizone\" ng-class=\"bmiZone.colorClass\"></rect><rect class=\"weightscale-indicator\" ng-attr-x=\"{{indicator.x}}\" ng-attr-y=\"{{indicator.y}}\" ng-attr-width=\"{{indicator.width}}\" ng-attr-height=\"{{indicator.height}}\"></rect><rect class=\"weightscale-tick\" ng-repeat=\"tick in ticks\" ng-attr-x=\"{{tick.x}}\" ng-attr-y=\"{{tick.y}}\" ng-attr-width=\"{{tick.width}}\" ng-attr-height=\"{{tick.height}}\"></rect><text class=\"weightscale-tick-text\" ng-repeat=\"tick in ticks\" ng-attr-x=\"{{tick.xText}}\" ng-attr-y=\"{{tick.yText}}\">{{tick.text}}</text><rect class=\"weightscale-border\" ng-attr-width=\"{{dimensions.border.width}}\" ng-attr-height=\"{{dimensions.border.height}}\" ng-attr-x=\"{{dimensions.border.x}}\" ng-attr-y=\"{{dimensions.border.y}}\" ng-attr-stroke-width=\"{{dimensions.border.thickness}}\"></rect></g></svg>");
}]);

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
              clickFunction : '&clickDataPoint'
            },
            link : link
          };
        } ]);
var sleepcycle = angular.module('sleepcycle', ['templates-sleepcycle']);

sleepcycle.directive('sleepCycle', function(){
  function colorForTick(tick, daytime){
    var colorClass = '';
    if(daytime){
      colorClass = 'daytime-';
    } else {
      colorClass = 'nighttime-';
    }
    tick = Math.floor(tick);
    if(tick >= 6){
      colorClass += (5 - (tick % 6));
    } else {
      colorClass += tick;
    }
    return colorClass;
  }
  function hourToTick(hour){
    var angle = 0;
    if (hour > 12) {
      angle = 360 * (hour - 12) / 24;
    } else {
      angle = 360 * (hour + 12) / 24;
    }
    return {
      angle : angle,
      text : hour,
      textTranslate : hour > 9 ? -8 : -4
    };
  }
  function deg2rad(val){
    return val*Math.PI/180;
  }
  function rad2deg(val){
    return val*180/Math.PI;
  }
  function angleToHour(angle){
    var hour = 6 + (angle*12/Math.PI);
    if(hour < 0){
      return hour + 24;
    }
    return hour;
  }
  function paintData(newValue, oldValue, scope){
    /**
     * sleepData is an array of JSON objects, each object has:
     * * startTime : Javascript Date object
     * * endTime : Javascript Date object
     * * colorClass : css class that defines the color.
     * * description: Text description of the sleep object.
     */
    scope.sleepEvents = [];
    scope.sleepData.forEach(function(val){
      var eventData = {
          innerRadius: scope.outerArc.innerRadius,
          outerRadius : scope.outerArc.outerRadius,
          startAngle: deg2rad(hourToTick(val.startTime.getHours() + val.startTime.getMinutes()/60).angle + 180),
          endAngle: deg2rad(hourToTick(val.endTime.getHours() + val.endTime.getMinutes()/60).angle + 180),
      };
      eventData.path = scope.arcDefinition(eventData);
      eventData.colorClass = val.colorClass;
      eventData.description = val.description;
      scope.sleepEvents.push(eventData);
      scope.currentDate = scope.sleepData[0].startTime.toLocaleDateString();
      if(scope.sleepData[0].startTime.getHours() <= 12){
        scope.breakpointInDate = false;
      } else {
        scope.breakpointInDate = true;
        scope.dateBeforeMidnight = scope.sleepData[0].startTime;
        scope.dateAfterMidnight = new Date(scope.sleepData[0]
          .startTime.getTime() + 24*3600*1000 + 1);
        scope.breakpointHour = scope.sleepData[0].startTime.getHours();
      }
    });
  };
  return {
    restrict : 'E',
    templateUrl : 'templates/sleepcycle.tpl.html',
    scope : {
      width : '@',
      sleepData : '=',
      sleepQuality : '@',
      sunrise : '@',
      sunset : '@'
    },
    link : function(scope, element, attr){
      // Initialize
      scope.rootElement = element[0];
      scope.width = parseFloat(scope.width);
      scope.bottomMargin = 20;
      scope.height = scope.width + scope.bottomMargin;
      scope.clockPath = "";
      scope.clock = {
        innerRadius : 0,
        outerRadius : 0.3 * scope.width,
        startAngle : 0,
        endAngle : 2 * Math.PI
      };
      scope.center = scope.width / 2;
      scope.arcDefinition = d3.svg.arc();
      scope.clockPath = scope.arcDefinition(scope.clock);
      scope.ticks = _.map(_.range(24), hourToTick);
      scope.outerArc = {
        innerRadius : scope.clock.outerRadius,
        outerRadius : 0.1 * scope.width + scope.clock.outerRadius,
        startAngle : 0,
        endAngle : 2 * Math.PI
      };
      scope.outerArcPath = scope.arcDefinition(scope.outerArc);
      scope.sleepEvents = [];
      scope.$watchCollection('sleepData', paintData);
      scope.eventText = 'Idle';
      scope.mouseoverEvent = function(eventItem){
        if(eventItem){
          scope.eventText = eventItem.description;
        } else {
          scope.eventText = 'Idle';
        }
      };
      scope.sunPath = scope.arcDefinition({
        innerRadius : scope.outerArc.outerRadius,
        outerRadius : scope.outerArc.outerRadius + 20,
        startAngle : 0,
        endAngle : 2 * Math.PI
      });
      scope.clockHandPath = 'M0,0V' + (scope.outerArc.outerRadius -
          scope.outerArc.innerRadius);
      scope.clockHandAngle = 0;
      scope.currentDate = "";
      scope.movement = function(event){
        var centerX = scope.rootElement.offsetLeft + scope.center;
        var centerY = scope.rootElement.offsetTop + scope.center;
        var angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
        scope.clockHandAngle = rad2deg(angle) - 90;
        var hour = angleToHour(angle);
        var daylight = scope.sunset - scope.sunrise;
        var nighttime = 24 - daylight;
        if(hour >= scope.sunrise && hour <= scope.sunset){
          var tick = daylight/12;
          var ticks = (hour - scope.sunrise) / tick;
          scope.sunClass = colorForTick(ticks, true);
        } else {
          var tick = nighttime/12;
          var ticks = null;
          if(hour - scope.sunset > 0){
            ticks = (hour - scope.sunset) / tick;
          } else {
            ticks = (hour + 24 - scope.sunset) / tick;
          }
          scope.sunClass = colorForTick(ticks, false);
        }
        if(scope.breakpointInDate){
          if(hour < scope.breakpointHour){
            scope.currentDate = scope.dateAfterMidnight.toLocaleDateString();
          } else {
            scope.currentDate = scope.dateBeforeMidnight.toLocaleDateString();
          }
        }
      };
      scope.$watch('sleepQuality', function(){
        var minFont = 12;
        var maxFont = 18;
        var fontSize = (maxFont - minFont)*scope.sleepQuality/100 + minFont;
        scope.qualityText = scope.sleepQuality + '%';
        scope.qualityStyle = {'font-size' : fontSize + 'px'};
      });
    }
  };
});

sleepcycle.filter('clockticks', function(){
  return function(input){
    return _.filter(input, function(val){
      return parseInt(val.text) % 3 == 0;
    });
  };
});
angular.module('weightscale', [ 'templates-weightscale' ]).factory(
    'bmiZones',
    function(){
      return function(lowBmi, highBmi){
        var breakpoints = {
          '16' : {
            name : 'Severe thinness',
            colorClass : 'weightscale-bmi-severe-thinness',
          },
          '17' : {
            name : 'Moderate thinness',
            colorClass : 'weightscale-bmi-moderate-thinness',
          },
          '18.5' : {
            name : 'Mild thinness',
            colorClass : 'weightscale-bmi-mild-thinness'
          },
          '25' : {
            name : 'Normal',
            colorClass : 'weightscale-bmi-normal',
          },
          '30' : {
            name : 'Overweight',
            colorClass : 'weightscale-bmi-overweight',
          },
          '35' : {
            name : 'Obese class I',
            colorClass : 'weightscale-bmi-obese-i',
          },
          '40' : {
            name : 'Obese class II',
            colorClass : 'weightscale-bmi-obese-ii',
          },
          '100' : {
            name : 'Obese class III',
            colorClass : 'weightscale-bmi-obese-iii',
          },
        };
        var sortedBreakpoints = _.sortBy(_.keys(breakpoints), function(val){
          return parseFloat(val);
        });
        var sortedBreakpointsCount = sortedBreakpoints.length;
        var lowIndex = -1;
        var highIndex = -1;
        for (var i = 0; i < sortedBreakpointsCount - 1; i++) {
          if (parseFloat(sortedBreakpoints[i]) > lowBmi) {
            lowIndex = i;
            break;
          }
        }
        for (var i = sortedBreakpointsCount - 2; i >= 0; i--) {
          if (parseFloat(sortedBreakpoints[i]) < highBmi) {
            highIndex = i;
            break;
          }
        }
        var result = new Array();
        if (lowIndex == -1) {
          result.push({
            interval : [ lowBmi, highBmi ],
            bmiInfo : breakpoints[sortedBreakpoints[highIndex + 1]]
          });
        } else if (highIndex == -1) {
          result.push({
            interval : [ lowBmi, highBmi ],
            bmiInfo : breakpoints[sortedBreakpoints[lowIndex]]
          });
        } else if (lowIndex == highIndex + 1){
          result.push({
            interval : [lowBmi, highBmi],
            bmiInfo : breakpoints[sortedBreakpoints[lowIndex]],
          });
        } else {
          for (var i = lowIndex; i <= highIndex; i++) {
            if (i == lowIndex) {
              result.push({
                interval : [ lowBmi, parseFloat(sortedBreakpoints[i]) ],
                bmiInfo : breakpoints[sortedBreakpoints[i]],
              });
            } else {
              result.push({
                interval : [ parseFloat(sortedBreakpoints[i - 1]),
                    parseFloat(sortedBreakpoints[i]) ],
                bmiInfo : breakpoints[sortedBreakpoints[i]],
              });
            }
          }
          result.push({
            interval : [ parseFloat(sortedBreakpoints[highIndex]), highBmi ],
            bmiInfo : breakpoints[sortedBreakpoints[highIndex + 1]],
          });
        }
        return result;
      };
    }).directive(
    'weightScale',
    [
        'bmiZones',
        function(bmiZones){
          return {
            restrict : 'E',
            scope : {
              width : '@',
              height : '@',
              quote : '@',
              weight : '@',
              bmi : '@'
            },
            link : link,
            templateUrl : 'templates/weightscale.tpl.html'
          };
          function link(scope, element, attr){
            initDimensions(scope);
            initScale(scope);
            initAxis(scope);
            scope.$watch('weight', updateScale);
            scope.$watch('bmi', updateScale);
          }
          /**
           * Initialize the dimensions of the scale in the given scope.<br>
           * 
           * The specific elements created are: <br> * dimensions - Basic
           * dimensions of the scale. <br> * margins - Margins of the scale <br>
           * 
           */
          function initDimensions(scope){
            scope.dimensions = {
              width : 200,
              height : 200,
              tickWidth : 4,
              tickHeight : 5,
            };
            scope.margins = {
              left : 20,
              right : 20,
              top : 20,
            };
            scope.dimensions.viewHeight = scope.dimensions.height
                - scope.margins.top;
            scope.dimensions.viewWidth = scope.dimensions.width
                - scope.margins.left - scope.margins.right;
            scope.dimensions.border = {
              thickness : 2,
              x : 1,
              y : 1,
            };
            scope.dimensions.border.width = scope.dimensions.viewWidth
                - scope.dimensions.border.thickness;
            scope.dimensions.border.height = scope.dimensions.viewHeight
                - scope.dimensions.border.thickness;
            scope.$watch('width', updateDimensions);
            scope.$watch('height', updateDimensions);
          }
          /**
           * Listener to changes on width and height.
           */
          function updateDimensions(newValue, oldValue, scope){
            if (scope.width !== undefined && scope.width >= 200) {
              scope.dimensions.width = parseInt(scope.width);
              scope.dimensions.viewWidth = scope.dimensions.width
                  - scope.margins.left - scope.margins.right;
              scope.dimensions.border.width = scope.dimensions.viewWidth
                  - scope.dimensions.border.thickness;
            }
            if (scope.height !== undefined && scope.height >= 200) {
              scope.dimensions.height = parseInt(scope.height);
              scope.dimensions.viewHeight = scope.dimensions.height
                  - scope.margins.top;
              scope.dimensions.border.height = scope.dimensions.viewHeight
                  - scope.dimensions.border.thickness;
            }
            updateScale(undefined, undefined, scope);
          }
          /**
           * Initialize the data values of the scale in the given scope.
           */
          function initScale(scope){
            scope.weight = 10;
            scope.bmi = 10;
            scope.indicator = {
              x : 0,
              y : 0,
              height : scope.dimensions.viewHeight,
              width : scope.dimensions.tickWidth,
            };
            scope.bmiZones = [];
          }
          function updateScale(newValue, oldValue, scope){
            scope.weight = scope.weight || 10.0;
            scope.bmi = scope.bmi || 10.0;
            scope.weight = parseFloat(scope.weight);
            scope.bmi = parseFloat(scope.bmi);
            scope.lowWeight = Math.floor(scope.weight - 10);
            scope.highWeight = Math.ceil(scope.weight + 10);
            scope.lowBmi = scope.lowWeight * scope.bmi / scope.weight;
            scope.highBmi = scope.highWeight * scope.bmi / scope.weight;
            var bmiIntervals = bmiZones(scope.lowBmi, scope.highBmi);
            var bmiIntervalsCount = bmiIntervals.length;
            scope.bmiZones = _.map(bmiIntervals, function(ele){
              var zone = {
                width : Math.ceil(scope.dimensions.viewWidth
                    * (ele.interval[1] - ele.interval[0])
                    / (scope.highBmi - scope.lowBmi)),
                height : scope.dimensions.viewHeight,
                y : 0,
                x : Math.floor(scope.dimensions.viewWidth
                    * (ele.interval[0] - scope.lowBmi)
                    / (scope.highBmi - scope.lowBmi)),
                colorClass : ele.bmiInfo.colorClass,
              };
              return zone;
            });
            scope.indicator.x = (scope.weight - scope.lowWeight)
                * scope.dimensions.viewWidth
                / (scope.highWeight - scope.lowWeight) - scope.indicator.width
                / 2;
            updateAxis(scope);
          }
          /**
           * Initialize the axis elements.
           */
          function initAxis(scope){
            scope.ticks = [];
          }
          /**
           * Define the ticks in the scale.
           */
          function updateAxis(scope){
            scope.ticks = _.map(_.range(scope.lowWeight + 1, scope.highWeight,
                1), function(val, idx){
              var tick = {
                width : scope.dimensions.tickWidth,
                height : scope.dimensions.tickHeight,
                x : (idx + 1) * scope.dimensions.viewWidth
                    / (scope.highWeight - scope.lowWeight)
                    - scope.indicator.width / 2,
                text : val
              };
              tick.y = scope.dimensions.viewHeight
                  - scope.dimensions.border.thickness
                  - scope.dimensions.tickHeight;
              tick.xText = tick.x + tick.width / 2;
              tick.yText = tick.y - 2;
              return tick;
            });
          }
        } ]);