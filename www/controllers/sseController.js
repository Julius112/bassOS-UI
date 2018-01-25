ons.bootstrap('bassOS', ['sse']);
angular.module('bassOS', ['onsen', 'MpdService']);


angular.module('bassOS').controller("sseCtl", function($scope, $rootScope, $http){
	//TODO: load list from backend service
	var events = {"switch_event" : {"id" : 1}, "settings_event" : {"id" : 2}, "playlist_event" : {"id" : 3}};
	
	var switch_event = function (event_data) {
		for (var i = 0; i < $rootScope.switch_array.length; i++) {
			if($rootScope.switch_array[i].id == event_data.id)
            			$rootScope.$apply(function () {
					$rootScope.switch_array[i].state = event_data.state;
				});
		}
	};
	
	var settings_event = function (event_data) {
		for ( key in event_data ) {
			$rootScope.$apply(function () {
				$rootScope.settings[key].state = event_data[key].state;
			});
		}
	};
	
	var playlist_event = function (event_data) {
		
	};
	
	// handles the callback from the received event
	var handleCallback = function (event_msg) {
		var msg = JSON.parse(event_msg.data);
		switch(msg.event_id) {
			case events.switch_event.id:
				switch_event(msg.event_data);
				break;
			case events.settings_event.id:
				settings_event(msg.event_data);
				break;
			case events.playlist_event.id:
	                        playlist_event(msg.event_data);
	                        break;
		}
	}
	
	var source = new EventSource("http://"+window.location.hostname+":3000/events");
	source.addEventListener('message', handleCallback, false);
});
