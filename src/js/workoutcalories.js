angular.module('workoutcalories', ['templates-workoutcalories'])
  .directive('workoutCalories', function(){
    function link(scope, element, attr){
      scope.rootElement = element[0];
      scope.d3Element = d3.select(scope.rootElement);
      scope.margins = {};
      scope.$watch('width', function(){
        scope.width = parseInt(scope.width);
        scope.margins.horizontal = scope.width > 500 ? scope.width*0.1 : 50;
        scope.xScale.range([0, scope.width - 2*scope.margins.horizontal]);
        updateAxis();
        drawArea();
      });
      scope.$watch('height', function(){
        scope.height = parseInt(scope.height);
        scope.margins.vertical = scope.height > 500 ? scope.height*0.1 : 50;
        scope.yScale.range([0, scope.height/2 - scope.margins.vertical]);
        drawArea();
      });
      // Definition of x-scale
      scope.xScale = d3.time.scale(); // scope.xScale is a function that takes in a date and returns a pixel value
      scope.xAxisGen = d3.svg.axis() // Initialize the generator for axis
        .scale(scope.xScale)
        .orient('bottom')
        .ticks(7);
      // Area generator
      scope.yScale = d3.scale.linear();
      scope.dataGenerator = d3.svg.area() // Generator for the area
        .x(function(dataPoint){
          return scope.xScale(dataPoint.day);
        })
        .y0(function(){
          return scope.height - 2*scope.margins.vertical;
        }).
        y1(function(dataPoint){
          return scope.yScale(dataPoint.calories);
        })
        .interpolate('cardinal');
      this.caloriesDataWatch = function(){
        if(scope.caloriesData !== undefined){
          scope.xScale.domain(d3.extent(scope.caloriesData, function(val){
            return val.day;
          }));
          scope.yScale.domain(d3.extent(scope.caloriesData, function(val){
            return val.calories;
          }));
          updateAxis();
          drawArea();
        }
      };
      this.updateAxis = function(){
        scope.d3Element.select('.x-axis')
        .call(scope.xAxisGen); // Call the scope.xAxisGen function with the selection as argument
      };
      this.drawArea = function(){
        scope.caloriesPath = scope.dataGenerator(scope.caloriesData);
      };
      scope.$watch('caloriesData', this.caloriesDataWatch);
      scope.$watchCollection('caloriesData', this.caloriesDataWatch);
    }
    return {
      restrict : 'E', // Only can be used as <workout-calories></workout-calories>
      link : link, 
      templateUrl : 'templates/workoutcalories.tpl.html',
      scope : {
        width : '@w',
        height : '@h',
        caloriesData : '=' // Calories data is expected to be of this format : [{'day' : Javascript Date object, 'calories' : Float}]
      }
    };
  });