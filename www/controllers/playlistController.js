angular.module('bassOS').controller('playlistCtl', function($scope, mpd) {
	$scope.curSong = "Loading";
	mpd.mpd_client.on('Connect', function(){
		$scope.$apply(function() {
			//console.log( $scope.curSong);
			$scope.currentSong = mpd.mpd_client.getCurrentSongID();
			$scope.playlist = mpd.mpd_client.getQueue().getSongs();
		});
	});
}); 
