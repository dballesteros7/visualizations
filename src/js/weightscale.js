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