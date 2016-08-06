var express = require('express');
var app     = express();
var path    = require('path');
var http    = require('http').Server(app);

app.use(express.static(__dirname +'/../dist'));

http.listen(3000, function () {
    console.log('listening on *:3000');
});