angular.module('bassOS').controller('playlistCtl', function($scope, mpd) {
	$scope.curSong = "Loading";
	mpd.mpd_client.on('Connect', function(){
		$scope.$apply(function() {
			//$scope.curSong = mpd.mpd_client.getCurrentSong().getTitle();
			//console.log( $scope.curSong);
			$scope.playlist = mpd.mpd_client.getQueue().getSongs();
			console.log($scope.playlist);
		});
	});
}); 
