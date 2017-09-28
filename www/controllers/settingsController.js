angular.module('bassOS').controller('settingsCtl', function($scope, $rootScope, $http) {
	//TODO: load list from backend service
	$rootScope.settings = {"mpd": {"state":false, "active":false}, "bluetooth": {"state":false, "active":false}, "bluetooth_pairable":{"state":false, "active":false}, "airplay":{"state":false, "active":false}, "auto_source":{"state":false, "active":false}};

	$http({
		method : "GET",
		url : "/settings"
        }).then(function mySucces(response) {
		for (var i = 0; i < response.data; i++)
			if ($rootScope.settings.hasOwnProperty(response.data[i].name)) {
				$rootScope.settings[key].state = response.data[i].status;
				$rootScope.settings[key].active = true;
				$rootScope.settings[key].id = response.data[i].id;
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
				url : "/settings/"+settings_obj.id
			});
		}, 1);
	};

	$scope.halt = function() {
		$http({
			method : "PUT",
			data: {},
			url : "os/shutdown"
		});
	};

	$scope.reboot = function() {
		$http({
			method : "PUT",
			data: {},
			url : "os/reboot"
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
