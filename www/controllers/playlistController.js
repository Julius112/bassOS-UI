angular.module('bassOS').controller('playlistCtl', function($scope, mpd) {
	/* INIT */
	$scope.playing = false;

	var playSongNext = (song) => {
		var current_pos = mpd.mpd_client.getCurrentSongQueueIndex();
		if (song.getQueuePosition() < current_pos)
			mpd.mpd_client.moveSongOnQueueById(song.getId(), current_pos);
		else
			mpd.mpd_client.moveSongOnQueueById(song.getId(), current_pos + 1);
	};

	var playSong = (song) => {
		mpd.mpd_client.playById(song.getId());
	};

	/* MPD CONNECT */
	mpd.mpd_client.on('Connect', () => {
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
	});

	/* QUEUE UPDATE */
	mpd.mpd_client.on('QueueChanged', (newQueue) => {
		$scope.$apply(() => {
			$scope.queue = newQueue.getSongs();
		});
	});

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

	$scope.clickSong = (song) => {
		ons.notification.alert(
			{
				message: song.getDisplayName(),
				buttonLabels: ["Als Nächstes", "Jetzt", "Abbrechen"],
				title: "Song Abspielen",
				cancelable: true,
				primaryButtonIndex: 0
			}
		).then((buttonId) => {
			if(buttonId == 0)
				playSongNext(song);
			else if (buttonId == 1)
				playSong(song);
		});
	};

	$scope.queueRemoveSelected = () => {
		$scope.queue.forEach((song) => {
			if (song.selected)
				mpd.mpd_client.removeSongFromQueueById(song.getId());
		});
	};

	$scope.setPlayback = (playing) => {
		if (playing)
			mpd.mpd_client.pause();
		else
			mpd.mpd_client.play();
	};

	$scope.setPlaybackNext = () => {
		mpd.mpd_client.next();
	};

});
