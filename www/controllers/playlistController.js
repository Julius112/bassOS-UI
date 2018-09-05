angular.module('bassOS').controller('playlistCtl', function($scope, mpd) {
	/* INIT */
	$scope.playing = false;

	var playSongNext = (song) => {
		var current_pos = mpd.mopidy.getCurrentSongQueueIndex();
		if (song.getQueuePosition() < current_pos)
			mpd.mopidy.moveSongOnQueueById(song.getId(), current_pos);
		else
			mpd.mopidy.moveSongOnQueueById(song.getId(), current_pos + 1);
	};

	var playSong = (song) => {
		mpd.mopidy.playById(song.getId());
	};

	/* MPD CONNECT */
	mpd.mopidy.on('state:online', () => {
    var cur_song;
    mpd.mopidy.playback.getCurrentTrack()
    .then((track) => {
      cur_song = track || {title: "Not Available"};
      $scope.$apply(() => {
			  $scope.currentSongId = cur_song.tlid;
        if (Array.isArray(cur_song.artists))
			    $scope.currentSongName = " " + cur_song.name + " - " + cur_song.artists.map(artist => artist.name).join(', ');
			  else
			    $scope.currentSongName = cur_song.name;
      });
    })
    mpd.mopidy.playback.getState()
    .then((state) => {
      $scope.$apply(() => {
		    $scope.playing = (state === "PLAYING");
      });
    });
    mpd.mopidy.tracklist.getTracks()
    .then((tracks) => {
      $scope.$apply(() => {
		    $scope.queue = tracks;
      });
    });
	});

	/* QUEUE UPDATE */
	mpd.mopidy.on('event:tracklistChanged', () => {
    mpd.mopidy.tracklist.getTracks()
    .then((tracks) => {
		  $scope.$apply(() => {
		    $scope.queue = tracks;
      });
		});
	});

	mpd.mopidy.on('event:playbackStateChanged', () => {
    var cur_song;
    mpd.mopidy.playback.getState()
    .then((state) => {
		  $scope.$apply(() => {
		    $scope.playing = (state === "PLAYING");
      });
    });
    mpd.mopidy.playback.getCurrentTrack()
    .then((track) => {
      cur_song = track;
		  $scope.$apply(() => {
        if (Array.isArray(cur_song.artists))
			    $scope.currentSongName = " " + cur_song.name + " - " + cur_song.artists.map(artist => artist.name).join(', ');
		    else
			    $scope.currentSongName = cur_song.name;
      });
    });
	});


	/* STATE UPDATE */
	mpd.mopidy.on('StateChanged', (newState) => {
		var cur_song = mpd.mopidy.getCurrentSong();
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
    var remove_list = [];
		$scope.queue.forEach((song) => {
			if (song.selected)
        remove_list.append(song.tlid);
		});
		mpd.mopidy.remove({'tlid': remove_list});
	};

	$scope.setPlayback = (playing) => {
		if (!playing)
			mpd.mopidy.playback.pause();
		else
			mpd.mopidy.playback.play();
	};

	$scope.setPlaybackNext = () => {
		mpd.mopidy.playback.next();
	};

  $scope.allArtists = (song, max_len) => {
    var artists = song.artists.map(artist => artist.name).join(', ');
    if (typeof max_len === "number")
      return (artists.length > max_len) ? artists.substr(0, max_len - 1) + '...' : artists;
    else
      return artists;
  };

});
