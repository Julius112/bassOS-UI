angular.module('bassOS').controller('settingsCtl', function($scope, $rootScope, $http) {
	//TODO: load list from backend service
	$rootScope.settings = {"mpd": {"state":false, "active":false}, "bluetooth": {"state":false, "active":false}, "bluetooth_pairable":{"state":false, "active":false}, "airplay":{"state":false, "active":false}, "auto_source":{"state":false, "active":false}};

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
