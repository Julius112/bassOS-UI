/* Create angular service */
var MpdService = angular.module('MpdService', [])
.service('mpd', function () {
  this.mopidy = new Mopidy({
    webSocketUrl: "ws://"+window.location.hostname+":6680/mopidy/ws/",
    callingConvention: "by-position-or-by-name"
  });
  //this.mopidy.on(console.log.bind(console));
});
