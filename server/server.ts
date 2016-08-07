///<reference path="../typings/index.d.ts"/>

"use strict";

import * as express from "express";
import * as http from "http";
import * as socketIO from "socket.io";
import Socket = SocketIO.Socket;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

let hostConnection: Connection;
let activeUserConnection: Connection;
let pendingUserConnections: Connection[] = [];

app.use(express.static(__dirname + "/../dist"));

io.on("connection", function (socket: Socket) {

    let connection: Connection = {
        socket: socket,
        type: null
    };

    if ("localhost:3000" === socket.handshake.headers.host) {
        connection.type = "host";
        hostConnection = connection;
    } else {
        connection.type = "user";
        if (undefined === activeUserConnection) {
            activeUserConnection = connection;
        } else {
            pendingUserConnections.push(connection);
        }
    }

    socket.emit("status", connection.type);

    console.log("a " + connection.type + " connected from " + socket.client.conn.remoteAddress);

    socket.on("reset", function () {
        console.log("reset");
        io.emit("reset");
    });

    socket.on("setCategory", function (categoryName) {
        console.log("setCategory", categoryName);
        io.emit("setCategory", categoryName);
    });

    socket.on("setAnswer", function (questionNo, answerKey) {
        console.log("setAnswer", questionNo, answerKey);
        io.emit("setAnswer", questionNo, answerKey);
    });

    socket.on("disconnect", function () {
        console.log("user disconnected");
    });
});

server.listen(3000, function () {
    console.log("listening on *:3000");
});

type ConnectionType = "host" | "user";

interface Connection {
    socket: Socket;
    type: ConnectionType;
}