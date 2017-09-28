angular.module('bassOS').controller('switchCtl', function($scope, $rootScope, $http) {
	//TODO: load list from backend service
	$rootScope.switch_array = [{"id":1, "name":"Unterboden", "state":false, "active":false, "icon_on":"ion-ios-lightbulb", "icon_off":"ion-ios-lightbulb-outline"},
				{"id":2, "name":"Hupe", "state":false, "active":false, "icon_on":"ion-speakerphone", "icon_off":"ion-speakerphone"}];

		$http({
			method : "GET",
			url : "/switches"
          	}).then(function mySucces(response) {
			for (var i = 0; i < response.data.length; i++)
				for (var j = 0; j < $rootScope.switch_array.length; j++)
					if (response.data[i].id == $rootScope.switch_array[j].id) {
						$rootScope.switch_array[j].active = true;
						$rootScope.switch_array[j].state = response.data[i].status;
					}
		}, function myError(response) {
				for (var j = 0; j < $rootScope.switch_array.length; j++)
					$rootScope.switch_array[j].active = false;
		});

	$scope.switch_change = function(switch_obj) {
		setTimeout(function() {
		$http({
			method : "PUT",
			data: {"status" : switch_obj.state},
			url : "/switches/"+switch_obj.id
		});
		}, 1);
	};

}).directive('myTouchend', function() {
	return function(scope, element, attr) {
		element.on('touchend', function(event) {
			scope.$apply(function() { 
				scope.$eval(attr.myTouchend); 
			});
		});
	};
});; 
