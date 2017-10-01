/* Create angular service */
var MpdService = angular.module('MpdService', [])
.service('mpd', function () {
    this.mpd_client = MPD(8800);
});
