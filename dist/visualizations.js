angular.module('templates-sleepcycle', ['templates/sleepcycle.tpl.html']);

angular.module("templates/sleepcycle.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sleepcycle.tpl.html",
    "<svg ng-mousemove=\"movement($event)\" ng-attr-width=\"{{width}}\" ng-attr-height=\"{{width}}\"><defs><lineargradient id=\"sun-grad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\"><stop offset=\"0%\" style=\"stop-color:#FF8034;stop-opacity:1\"><stop offset=\"100%\" style=\"stop-color:#FFC02D;stop-opacity:1\"></lineargradient></defs><g><path class=\"clock\" ng-attr-d=\"{{clockPath}}\" ng-attr-transform=\"translate({{center}}, {{center}})\"></path><path class=\"tick\" ng-repeat=\"tick in ticks\" d=\"M0 0L0 10\" ng-attr-transform=\"translate({{center}}, {{center}}) rotate({{tick.angle}}) translate(0, {{clock.outerRadius -10}})\"></path><text class=\"tick-text\" ng-repeat=\"tick in ticks | clockticks\" ng-attr-transform=\"translate({{center}}, {{center}})\n" +
    "                       rotate({{tick.angle}})\n" +
    "                       translate(0, {{clock.outerRadius -15}})\" text-anchor=\"middle\">{{tick.text}}</text><path class=\"outer-shell\" ng-attr-d=\"{{outerArcPath}}\" ng-attr-transform=\"translate({{center}}, {{center}})\" ng-mouseover=\"mouseoverEvent(null)\"></path><path ng-repeat=\"event in sleepEvents\" ng-attr-transform=\"translate({{center}}, {{center}})\" ng-attr-d=\"{{event.path}}\" ng-class=\"event.colorClass\" class=\"sleep-event\" ng-mouseover=\"mouseoverEvent(event)\"></path><text class=\"center-text\" ng-attr-transform=\"translate({{center}}, {{center}})\" text-anchor=\"middle\">{{eventText}}</text><path ng-attr-d=\"{{sunPath}}\" ng-attr-transform=\"translate({{center}}, {{center}})\" class=\"sun-border\" ng-class=\"sunClass\"></path><text class=\"center-text\" ng-attr-transform=\"translate({{center}}, {{center + 48}})\" text-anchor=\"middle\" ng-style=\"qualityStyle\">{{qualityText}}</text></g></svg>");
}]);

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
      scope.clockPath = "";
      scope.clock = {
        innerRadius : 0,
        outerRadius : 0.2 * scope.width,
        startAngle : 0,
        endAngle : 2 * Math.PI
      };
      scope.center = scope.width / 2;
      scope.arcDefinition = d3.svg.arc();
      scope.clockPath = scope.arcDefinition(scope.clock);
      scope.ticks = _.map(_.range(24), hourToTick);
      scope.outerArc = {
        innerRadius : scope.clock.outerRadius,
        outerRadius : 0.2 * scope.width + scope.clock.outerRadius,
        startAngle : 0,
        endAngle : 2 * Math.PI
      };
      scope.outerArcPath = scope.arcDefinition(scope.outerArc);
      scope.sleepEvents = [];
      scope.$watchCollection('sleepData', paintData);
      scope.eventText = 'Daytime';
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
      scope.movement = function(event){
        var centerX = scope.rootElement.offsetLeft + scope.center;
        var centerY = scope.rootElement.offsetTop + scope.center;
        var angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
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
      };
      scope.$watch('sleepQuality', function(){
        var minFont = 12;
        var maxFont = 48;
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