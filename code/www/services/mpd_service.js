

var MpdService = angular.module('MpdService', [])
.service('Mpd', function () {
    this.mpd_client = MPD(8800);

});
