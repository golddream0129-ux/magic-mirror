///<reference path="../typings/index.d.ts"/>

"use strict";

import * as core from "express-serve-static-core";
import * as express from "express";
import * as http from "http";
import * as socketIO from "socket.io";
import {HostConnection} from "./connection/HostConnection";
import {UserConnection} from "./connection/UserConnection";
import {Connection, States, Events} from "./connection/Connection";

export class Server {

    private _app: core.Express;
    private _server: http.Server;
    private _io: SocketIO.Server;

    private _hostConnections: HostConnection[] = [];
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
            this.addHostConnections(new HostConnection(this, socket));
        } else {
            this.addPendingUserConnection(new UserConnection(this, socket));
        }

        // We do this for all connections in case there are user's pending before the host connects
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
        // If there are no queued users, unset the activeUserConnection property
        if (!this.pendingUserConnections.length) {
            this.activeUserConnection = undefined;
            return;
        }

        this.activeUserConnection = this.pendingUserConnections.shift();
        this.activeUserConnection.activate();
    }

    dropConnection(connection: Connection) {
        if (connection instanceof HostConnection) {
            this.dropHostConnection(connection);
        } else if (connection instanceof UserConnection) {
            this.dropUserConnection(connection);
        }
    }

    /**
     * Drops a host connection by removing it from the hostConnections array
     *
     * @param {HostConnection} connection
     */
    dropHostConnection(connection: HostConnection): void {
        for (let i = this.hostConnections.length - 1; i >= 0; i--) {
            if (connection === this.hostConnections[1]) {
                this.hostConnections.splice(i, 1);
            }
        }
    }

    /**
     * Drops a host connection by removing it from the hostConnections array
     *
     * @param {UserConnection} connection
     */
    dropUserConnection(connection: UserConnection): void {

        // Either remove the active user
        if (connection = this.activeUserConnection) {
            connection.socket.emit(Events.setState, States.disconnected);
            this.activateNextUser();
            return;
        }

        // Or remove them from the pending users queue
        for (let i = this.pendingUserConnections.length - 1; i >= 0; i--) {
            if (connection === this.pendingUserConnections[1]) {
                this.pendingUserConnections.splice(i, 1);
            }
        }
    }

    get hostConnections(): HostConnection[] {
        return this._hostConnections;
    }

    addHostConnections(connection: HostConnection) {
        this._hostConnections.push(connection);
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
        this._pendingUserConnections.push(connection);
    }

    set pendingUserConnections(value: UserConnection[]) {
        this._pendingUserConnections = value;
    }
}