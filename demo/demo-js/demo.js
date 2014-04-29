var app = angular.module('demo', [ 'sleepcycle' ]);

app.controller('DemoCtrl', [ '$scope', '$http', function($scope, $http){
  $scope.data = [];
  function getColor(depth){
    switch (depth) {
    case 1:
      return 'awake';
    case 2:
      return 'light-sleep';
    case 3:
      return 'deep-sleep';
    }
  };
  function getDescription(val){
    switch (val.depth) {
    case 1:
      return 'Awake';
    case 2:
      return 'Light sleep';
    case 3:
      return 'Sound sleep';
    }
  };
  $http({
    url : '/data/sleep.json',
    method : 'GET',
  }).success(function(data, status, header, config){
    var items = data.ticks.data.items;
    var absoluteEnd = data.list.data.items[0].time_completed;
    var lastObject = null;
    items.forEach(function(val){
      if (lastObject) {
        lastObject.endTime = new Date(val.time * 1000);
      }
      var newEvent = null;
      newEvent = {
        startTime : new Date(val.time * 1000),
        colorClass : getColor(val.depth),
        description : getDescription(val)
      };
      lastObject = newEvent;
      $scope.data.push(lastObject);
    });
    lastObject.endTime = new Date(absoluteEnd * 1000);
    var tmpSunrise = new Date(data.list.data.items[0].details.sunrise * 1000);
    $scope.sunrise = tmpSunrise.getHours() + tmpSunrise.getMinutes() / 60;
    var tmpSunset = new Date(data.list.data.items[0].details.sunset * 1000);
    $scope.sunset = tmpSunset.getHours() + tmpSunset.getMinutes() / 60;
    $scope.quality = data.list.data.items[0].details.quality;
  });
} ]);