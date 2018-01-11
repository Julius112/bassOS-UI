angular.module('bassOS').controller('libraryMpdCtl', function($scope, mpd) {
	$scope.searchlist = [];

	$scope.select_song = (song) => {
		ons.notification.alert(
			{
				message: song.getDisplayName(),
				buttonLabels: ["Play Last", "Play Next", "Cancel"],
				title: "Queue Song",
				cancelable: true,
				primaryButtonIndex: 0
			}
		).then((buttonId) => {
			console.log(buttonId)
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
