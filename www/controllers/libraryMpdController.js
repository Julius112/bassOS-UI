angular.module('bassOS').controller('libraryMpdCtl', function($scope, mpd) {
	$scope.searchlist = [];

	$scope.select_song = (song) => {
		ons.notification.prompt({message: song.getDisplayName()})
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
