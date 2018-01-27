angular.module('bassOS').controller('songviewCtl', function($scope, mpd) {
	/* INIT */
	$scope.playing = false;
	$scope.song = {
		title : "loading...",
		artist : "",
		volume : "50",
		time: 1,
		duration: 1
	};

	var interval_id;

	/* INIT: When view is pushed */
	this.init = (e) => {
			// Ensure the emitter is the current page, not a nested one
			if (e.target === e.currentTarget) {
				var state = mpd.mpd_client.getState();
				var cur_song = mpd.mpd_client.getCurrentSong();
				$scope.$apply(() => {
					$scope.song.title = cur_song.getTitle();
					$scope.song.artist = cur_song.getArtist();
					$scope.song.duration = cur_song.getDuration() * 1000;
					$scope.song.volume = state.volume;
					$scope.playing = (state.playstate === "play");
				});
				updateSongTime();
				interval_id = setInterval(() => {
					if ($scope.playing)
						updateSongTime();
				},250);
			}
		};

	this.hide = () => {
		clearInterval(interval_id);
	}

	var updateSongTime = () => {
		$scope.$apply(() => {
			$scope.song.time = Math.round(mpd.mpd_client.getCurrentSongTime() * 1000);
		});
	};

	var playSongNext = (song) => {
		var current_pos = mpd.mpd_client.getCurrentSongQueueIndex();
		if (song.getQueuePosition() < current_pos)
			mpd.mpd_client.moveSongOnQueueById(song.getId(), current_pos);
		else
			mpd.mpd_client.moveSongOnQueueById(song.getId(), current_pos + 1);
	};

	/* MPD CONNECT */
	mpd.mpd_client.on('Connect', () => {
		var state = mpd.mpd_client.getState();
		var cur_song = mpd.mpd_client.getCurrentSong();
		$scope.$apply(() => {
			$scope.song.title = cur_song.getTitle();
			$scope.song.artist = cur_song.getArtist();
			$scope.song.volume = state.volume*100;
			$scope.song.duration = cur_song.getDuration() * 1000;
			$scope.playing = (state.playstate === "play");
		});
	});

	/* STATE UPDATE */
	mpd.mpd_client.on('StateChanged', (newState) => {
		var cur_song = mpd.mpd_client.getCurrentSong();
		$scope.$apply(() => {
			$scope.song.title = cur_song.getTitle();
			$scope.song.artist = cur_song.getArtist();
			$scope.song.duration = cur_song.getDuration() * 1000;
			$scope.song.volume = newState.volume*100;
			$scope.playing = (newState.playstate === "play");
			$scope.playing = (newState.playstate === "play");
		});
	});

	$scope.setPlayback = (playing) => {
		if (!playing)
			mpd.mpd_client.pause();
		else
			mpd.mpd_client.play();
	};

	$scope.setPlaybackPrevious = () => {
		mpd.mpd_client.previous();
	};

	$scope.setPlaybackNext = () => {
		mpd.mpd_client.next();
	};

});
