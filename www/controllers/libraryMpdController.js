angular.module('bassOS').controller('libraryMpdCtl', function($scope, mpd) {
	$scope.searchlist = [];

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
				queue_add_next(song);
			else if (buttonId == 1)
				queue_add_end(song);
		});
	};

	$scope.search_change = () => {
		var params = {any: $scope.search};
		mpd.mpd_client.search(params, (results) => {
			$scope.searchlist = [];
			results.forEach((option) => {
				$scope.searchlist.push(option);
			});
		});
	};
}); 
