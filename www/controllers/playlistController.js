angular.module('bassOS').controller('playlistCtl', function($scope, mpd) {
	/* INIT */
	$scope.playing = false;

	/* MPD CONNECT */
	mpd.mpd_client.on('Connect', () => {
		$scope.$apply(() => {
			var state = mpd.mpd_client.getState();
			$scope.currentSong = state.current_song.id;
			if (state.playstate === "PLAYING")
				$scope.playing = true;
			else
				$scope.playing = false;
			$scope.queue = state.current_queue.getSongs();
		});
	});

	/* QUEUE UPDATE */
	mpd.mpd_client.on('QueueChanged', (newQueue) => {
		console.log("change");
		$scope.$apply(() => {
			$scope.queue = newQueue.getSongs();
		});
	});

	/* STATE UPDATE */
	mpd.mpd_client.on('StateChanged', (newState) => {
		console.log("change");
		$scope.$apply(() => {
			$scope.currentSong = newState.current_song.id;
			if (newState.playstate === "PLAYING")
				$scope.playing = true;
			else
				$scope.playing = false;
			$scope.queue = newQueue.getSongs();
		});
	});


	$scope.playSong = (songId) => {
		mpd.mpd_client.playById(songId);
	}
}); 
