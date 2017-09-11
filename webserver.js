var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

/* Webserver Configuration */
var app = express();
var port = '3100';
app.set('port', port);

/* Serve Frontend */
app.use(express.static(__dirname + '/www'));

var server = http.createServer(app);
server.listen(port, function () {
});
