angular.module('bassOS').controller('libraryMpdCtl', function($scope, mpd) {
	$scope.searchlist = [];
	$scope.playing = false;

	/*** Feature dropped due to race condition when song is not queued but the old last song is moved to the next song
	var queue_add_next = (song) => {
		ons.notification.toast({
			message: "Eingereiht: " + song.getDisplayName(),
			timeout: 1500
		});
		mpd.mpd_client.getQueue().addSongByFile(song.getPath());
		var queue_songs = mpd.mpd_client.getQueue().getSongs();
		mpd.mpd_client.moveSongOnQueueById(queue_songs[queue_songs.length - 1].getId(), mpd.mpd_client.getNextSongQueueIndex());
	};
	*/

	var queue_add_end = (song) => {
		ons.notification.toast({
			message: "Eingereiht: " + song.getDisplayName(),
			timeout: 1500
		});
		mpd.mpd_client.getQueue().addSongByFile(song.getPath());
	};

	$scope.select_song = (song) => {
		ons.notification.alert(
			{
				message: song.getDisplayName(),
				//buttonLabels: ["Nächstes", "Am Ende", "Abbrechen"],
				buttonLabels: ["Ok", "Abbrechen"],
				title: "Song einreihen",
				cancelable: true,
				primaryButtonIndex: 0
			}
		).then((buttonId) => {
			if(buttonId == 0)
				queue_add_end(song);
		});
	};

	$scope.search_change = (search) => {
		var params = {any: search};
			mpd.mpd_client.search(params, (results) => {
				$scope.$apply(() => {
					$scope.searchlist = [];
					results.forEach((option) => {
						$scope.searchlist.push(option);
					});
				});
			});
	};

	/* INIT: When view is pushed */
	this.init = (e) => {
		// Ensure the emitter is the current page, not a nested one
		if (e.target === e.currentTarget) {
			var state = mpd.mpd_client.getState();
			var cur_song = mpd.mpd_client.getCurrentSong();
			$scope.$apply(() => {
				$scope.currentSongId = state.current_song.id;
				if (cur_song.getArtist())
					$scope.currentSongName = " " + cur_song.getTitle() + " - " + cur_song.getArtist();
				else
					$scope.currentSongName = cur_song.getDisplayName();
				$scope.playing = (state.playstate === "play");
				$scope.queue = state.current_queue.getSongs();
			});
		}
	}

	/* STATE UPDATE */
	mpd.mpd_client.on('StateChanged', (newState) => {
		var cur_song = mpd.mpd_client.getCurrentSong();
		$scope.$apply(() => {
			$scope.currentSongId = newState.current_song.id;
			if (cur_song.getArtist())
				$scope.currentSongName = " " + cur_song.getTitle() + " - " + cur_song.getArtist();
			else
				$scope.currentSongName = cur_song.getDisplayName();
			$scope.playing = (newState.playstate === "play");
			$scope.queue = newState.current_queue.getSongs();
		});
	});

	$scope.setPlayback = (playing) => {
		if (!playing)
			mpd.mpd_client.pause();
		else
			mpd.mpd_client.play();
	};

	$scope.setPlaybackNext = () => {
		mpd.mpd_client.next();
	};


}).directive('myKeyup', function() {
	return function(scope, element, attr) {
		element.on('keyup', function(event) {
			scope.$apply(function() {
				scope.$eval(attr.myKeyup);
			});
		});
	};
});
