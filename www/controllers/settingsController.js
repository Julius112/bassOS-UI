angular.module('bassOS').controller('settingsCtl', function($scope, $rootScope, $http) {
	//TODO: load list from backend service
	$rootScope.settings = {"mpd": {"state":false, "active":false}, "bluetooth": {"state":false, "active":false}, "bluetooth_pairable":{"state":false, "active":false}, "airplay":{"state":false, "active":false}, "auto_source":{"state":false, "active":false}};
	$rootScope.switch_array = [];//[{"id":1, "name":"Unterboden", "state":false, "active":false, "icon_on":"ion-ios-lightbulb", "icon_off":"ion-ios-lightbulb-outline"},
				//{"id":0, "name":"Hupe", "state":false, "active":false, "icon_on":"ion-speakerphone", "icon_off":"ion-speakerphone"}];


	/* Load switches from backend */
	$http({
		method : "GET",
		url : "http://"+window.location.hostname+":3000/switches"
        }).then(function mySucces(response) {
		for (var i = 0; i < response.data.length; i++) {
			var found = false;
			for (var j = 0; j < $rootScope.switch_array.length; j++)
				if ($rootScope.switch_array[j].name === response.data[i].name) {
					found = true;
					$rootScope.switch_array[j].state =  response.data[i].status;
				}
			if (!found)
				$rootScope.switch_array.push({id: response.data[i].id, name: response.data[i].name, state: response.data[i].status, active: true});
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
			url : "http://"+window.location.hostname+":3000/switches/"+switch_obj.id
		});
		}, 1);
	};


	/* Load settings from backend */
	$http({
		method : "GET",
		url : "http://"+window.location.hostname+":3000/settings"
        }).then(function mySucces(response) {
		for (var i = 0; i < response.data.length; i++)
			if ($rootScope.settings.hasOwnProperty(response.data[i].name)) {
				$rootScope.settings[response.data[i].name].state = response.data[i].status;
				$rootScope.settings[response.data[i].name].active = true;
				$rootScope.settings[response.data[i].name].id = response.data[i].id;
			}
	}, function myError(response) {
		for (var key in $rootScope.settings)
			$rootScope.settings[key].active = false;
	});

	$scope.settings_change = function(settings_obj) {
		setTimeout(function() {
			$http({
				method : "PUT",
				data: {status: settings_obj.state},
				url : "http://"+window.location.hostname+":3000/settings/"+settings_obj.id
			});
		}, 1);
	};

	$scope.halt = function() {
		$http({
			method : "PUT",
			data: {},
			url : "http://"+window.location.hostname+":3000/os/shutdown"
		});
	};

	$scope.reboot = function() {
		$http({
			method : "PUT",
			data: {},
			url : "http://"+window.location.hostname+":3000/os/reboot"
		});
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
