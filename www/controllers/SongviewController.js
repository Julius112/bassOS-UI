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
				var cur_song;
				$scope.page_nav = e.target.data.navigator;
        mpd.mopidy.mixer.getVolume()
        .then((vol) => {
				  $scope.$apply(() => {
				  	$scope.song.volume = vol || 50;
				  });
        })
        mpd.mopidy.playback.getState()
        .then((state) => {
				  $scope.$apply(() => {
			      $scope.playing = (state === "PLAYING");
          });
        });
        mpd.mopidy.playback.getCurrentTrack()
        .then((track) => {
          cur_song = track || {title: "Not Available"};
				  $scope.$apply(() => {
					  $scope.song.title = cur_song.name;
            if (Array.isArray(cur_song.artists))
					    $scope.song.artist = cur_song.artists.map(artist => artist.name).join(', ');
            else
              $scope.song.artist = "";
					  $scope.song.duration = Math.round(cur_song.length || 0);
          });
        })
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
    mpd.mopidy.playback.getTimePosition()
    .then((pos) => {
      $scope.$apply(() => {
	  		$scope.song.time = Math.round(pos || 0);
	  	});
    });
	};

	/* MPD CONNECT */
	mpd.mopidy.on('state:online', () => {
    mpd.mopidy.mixer.getVolume()
    .then((vol) => {
		  $scope.$apply(() => {
		  	$scope.song.volume = vol || 50;
		  });
    })
    mpd.mopidy.playback.getState()
    .then((state) => {
		  $scope.$apply(() => {
		    $scope.playing = (state === "PLAYING");
      });
    });
    mpd.mopidy.playback.getCurrentTrack()
    .then((track) => {
      cur_song = track || {title: "Not Available"};
		  $scope.$apply(() => {
			  $scope.song.title = cur_song.name;
        if (Array.isArray(cur_song.artists))
			    $scope.song.artist = cur_song.artists.map(artist => artist.name).join(', ');
        else
          $scope.song.artist = "";
			  $scope.song.duration = Math.round(cur_song.length || 0);
      });
    })
	});

  /* VOLUME UPDATE */
	mpd.mopidy.on('event:volumeChanged', () => {
    var mixer_vol;
    mpd.mopidy.mixer.getVolume()
    .then((vol) => {
      mixer_vol = vol || 50;
    })
		.then($scope.$apply(() => {
		  	$scope.song.volume = mixer_vol;
		  })
    );
	});

	/* STATE UPDATE */
/*	mpd.mpd_client.on('StateChanged', (newState) => {
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
*/
	$scope.setPlayback = (playing) => {
		if (!playing)
			mpd.mopidy.playback.pause();
		else
			mpd.mopidy.playback.play();
	};

	$scope.setPlaybackPrevious = () => {
		mpd.mopidy.playback.previous();
	};

	$scope.setPlaybackNext = () => {
	  mpd.mopidy.playback.next();
	};

	$scope.setVolumeUp = () => {
		var newVolume = $scope.song.volume + 5;
		if (newVolume > 100)
			newVolume = 100;
		mpd.mopidy.mixer.setVolume(newVolume / 100);
	};

	$scope.setVolumeDown = () => {
		var newVolume = $scope.song.volume - 5;
		if (newVolume < 0)
			newVolume = 0;
		mpd.mopidy.mixer.setVolume(newVolume / 100);
	};

	$scope.volumeChange = () => {
		if ($scope.song.volume > 100)
			$scope.song.volume = 100;
		else if ($scope.song.volume < 0)
			$scope.song.volume = 0;
		mpd.mopidy.mixer.setVolume($scope.song.volume / 100);
	}

}).directive('myTouchend', function() {
	return function(scope, element, attr) {
		element.on('touchend', function(event) {
			scope.$apply(function() {
				scope.$eval(attr.myTouchend);
			});
		});
	};
});
