var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

app.use(express.static(__dirname + '/../dist'));

io.on('connection', function (socket) {

    console.log('a user connected');

    socket.on('reset', function () {
        console.log("reset");
        io.emit('reset');
    });

    socket.on("setCategory", function (categoryName) {
        console.log("setCategory", categoryName);
        io.emit("setCategory", categoryName);
    });

    socket.on("setAnswer", function (questionNo, answerKey) {
        console.log("setAnswer", questionNo, answerKey);
        io.emit("setAnswer", questionNo, answerKey);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});