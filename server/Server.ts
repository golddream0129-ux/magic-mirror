///<reference path="../typings/index.d.ts"/>

"use strict";

import * as core from "express-serve-static-core";
import * as express from "express";
import * as http from "http";
import * as socketIO from "socket.io";
import {HostConnection} from "./connection/HostConnection";
import {UserConnection} from "./connection/UserConnection";
import {Connection, States, Events} from "./connection/Connection";
import Socket = SocketIOClient.Socket;

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
        this._io.on(Events.connect, this.connectionHandler);
    }

    connectionHandler = (socket: SocketIO.Socket) => {

        let connection: Connection;

        if ("localhost:3000" === socket.handshake.headers.host) {
            let hostConnection = new HostConnection(this, socket);
            this.addHostConnections(hostConnection);
            connection = hostConnection;
        } else {
            let userConnection = new UserConnection(this, socket)
            this.addPendingUserConnection(userConnection);
            connection = userConnection;

            // @todo - Remove debugging line
            this.dumpPendingConnections();

            this.updateQueuePositions();
        }

        connection.init();

        // We do this for all connections in case there are user's pending before the host connects
        if (undefined === this.activeUserConnection) {
            console.log("No active user");
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
        console.log("activating next user");

        // If there are no queued users, unset the activeUserConnection property
        if (!this.pendingUserConnections.length) {
            console.log("No pending connections");
            this.activeUserConnection = undefined;
            return;
        }

        this.activeUserConnection = this.pendingUserConnections.shift();
        console.log("Activating new connection (ID: " + this.activeUserConnection.id + ")");
        // @todo - Remove debugging line
        this.dumpPendingConnections();
        this.activeUserConnection.activate();
    }

    /**
     * Updates queue position for all pending users
     */
    updateQueuePositions(): void {
        console.log("updating queue positions for all connections");
        for (let i in this.pendingUserConnections) {
            let connection = this.pendingUserConnections[i];
            console.log("updating queue positions for #" + connection.id);
            connection.socket.emit(Events.setQueuePosition, i);
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Event emitters
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Emits the given event to the host & active user connections
     *
     * @param {string} eventName
     * @param {Array} args
     */
    emitToHostAndActiveUserConnections(eventName: string, args: any[]) {

        let socket: SocketIO.Socket;

        // Add the event name to the beginning of the args array
        args.unshift(eventName);

        // Send to host connections
        for (let i in this.hostConnections) {
            socket = this.hostConnections[i].socket;
            socket.emit.apply(socket, args);
        }

        // Send to active user
        socket = this.activeUserConnection.socket;
        socket.emit.apply(socket, args);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Connection event handlers
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Sends the selected connection to all the relevant connections
     *
     * @param {string} categoryName
     */
    setCategory = (categoryName: any) => {
        this.emitToHostAndActiveUserConnections(Events.setCategory, [categoryName]);
    };

    /**
     * Sends the selected connection to all the relevant connections
     *
     * @param {number} questionNo
     * @param {string} answerKey
     */
    setAnswer = (questionNo: number, answerKey) => {
        this.emitToHostAndActiveUserConnections(Events.setAnswer, [questionNo, answerKey]);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Connection modification methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Drops connections
     *
     * @param connection
     */
    dropConnection(connection: Connection) {
        console.log("Dropping connection");

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

        console.log("Dropping user connection");

        // Either remove the active user
        if (connection === this.activeUserConnection) {
            connection.socket.emit(Events.setState, States.disconnected);
            this.activateNextUser();
            return;
        }

        // Or remove them from the pending users queue
        for (let i = this.pendingUserConnections.length - 1; i >= 0; i--) {
            if (connection === this.pendingUserConnections[i]) {
                console.log("Removing connection #" + this.pendingUserConnections[i] + " from queue ");
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

    private dumpPendingConnections() {
        console.log("Pending connections...");
        for (let i in this.pendingUserConnections) {
            console.log("#" + this.pendingUserConnections[i].id);
        }
    }
}