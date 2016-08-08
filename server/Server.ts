///<reference path="../typings/index.d.ts"/>

"use strict";

import * as core from "express-serve-static-core";
import * as express from "express";
import * as http from "http";
import * as socketIO from "socket.io";
import {HostConnection} from "./connection/HostConnection";
import {UserConnection} from "./connection/UserConnection";

export class Server {

    private _app: core.Express;
    private _server: http.Server;
    private _io: SocketIO.Server;

    private _hostConnection: HostConnection;
    private _activeUserConnection: UserConnection;
    private _pendingUserConnections: UserConnection[] = [];

    constructor() {
        this._app = express();
        this._server = http.createServer(this._app);
        this._io = socketIO(this._server);

        this.addStaticFileHandler();

        this.addSocketConnectionHandler();
    }

    start(): void {
        this._server.listen(3000, function () {
            console.log("listening on *:3000");
        });
    }

    /**
     * Adds static routes
     */
    addStaticFileHandler(): void {
        let staticServer: core.Handler = express.static(__dirname + "/../web");
        console.log(staticServer);
        // noinspection TypeScriptValidateTypes
        this._app.use(staticServer);
    }

    /**
     * Adds handlers for socket
     */
    addSocketConnectionHandler(): void {
        this._io.on("connection", this.connectionHandler);
    }

    connectionHandler = (socket: SocketIO.Socket) => {

        if ("localhost:3000" === socket.handshake.headers.host) {
            this.hostConnection = new HostConnection(this, socket);
        } else {
            this.addPendingUserConnection(new UserConnection(this, socket));
        }

        if (undefined === this.activeUserConnection) {
            this.activateNextUser();
        }


        // socket.on("reset", function () {
        //     console.log("reset");
        //     io.emit("reset");
        // });
        //
        // socket.on("setCategory", function (categoryName) {
        //     console.log("setCategory", categoryName);
        //     io.emit("setCategory", categoryName);
        // });
        //
        // socket.on("setAnswer", function (questionNo, answerKey) {
        //     console.log("setAnswer", questionNo, answerKey);
        //     io.emit("setAnswer", questionNo, answerKey);
        // });
        //
        // socket.on("disconnect", function () {
        //     console.log("user disconnected");
        // });
    };

    activateNextUser(): void {
        this.activeUserConnection = this.pendingUserConnections.shift();
        this.activeUserConnection.activate();
    }


    get hostConnection(): HostConnection {
        return this._hostConnection;
    }

    set hostConnection(value: HostConnection) {
        this._hostConnection = value;
    }

    get activeUserConnection(): UserConnection {
        return this._activeUserConnection;
    }

    set activeUserConnection(value: UserConnection) {
        this._activeUserConnection = value;
    }

    get pendingUserConnections(): UserConnection[] {
        return this._pendingUserConnections;
    }

    /**
     * Adds a user connection to the pending connections array
     *
     * @param {UserConnection} connection
     */
    private addPendingUserConnection(connection: UserConnection): void {
        let pendingUserConnections = this.pendingUserConnections;
        pendingUserConnections.push(connection);
        this.pendingUserConnections = pendingUserConnections;
    }

    set pendingUserConnections(value: UserConnection[]) {
        this._pendingUserConnections = value;
    }
}