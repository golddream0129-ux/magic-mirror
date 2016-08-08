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

    /**
     * Connections from host machines
     *
     * @type {HostConnection[]}
     * @private
     */
    private _hostConnections: HostConnection[] = [];

    /**
     * The currently active user connection
     * @type {UserConnection}
     */
    private _activeUserConnection: UserConnection;

    /**
     * User connections awaiting the user to complete their name
     *
     * @type {UserConnection[]}
     * @private
     */
    private _startedUserConnections: UserConnection[] = [];

    /**
     * Pending user connections that are in the queue
     *
     * @type {UserConnection[]}
     * @private
     */
    private _pendingUserConnections: UserConnection[] = [];

    /**
     * @constructor
     */
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
            let userConnection = new UserConnection(this, socket);
            this.addStartedUserConnection(userConnection);
            connection = userConnection;

            // @todo - Remove debugging line
            this.dumpPendingConnections();
        }

        connection.init();

        // We do this for all connections in case there are user's pending before the host connects
        if (undefined === this.activeUserConnection) {
            console.log("No active user");
            this.activateNextUser();
        }
    };

    /**
     * Moves a user from the started queue to the pending queue
     *
     * @param connection
     */
    addUserConnectionToQueue(connection: UserConnection): void {

        // Remove user from started connections
        for (let i = this.startedUserConnections.length - 1; i >= 0; i--) {
            let startedUserConnection: UserConnection = this.startedUserConnections[i];
            if (connection === startedUserConnection) {
                console.log("Removing connection " + Server.getConnectionIdentifier(startedUserConnection) + " from queue ");
                this.startedUserConnections.splice(i, 1);
            }
        }

        // And add them to the pending queue
        this.addPendingUserConnection(connection);
    }

    activateNextUser(): void {
        // If there are no queued users, unset the activeUserConnection property
        if (!this.pendingUserConnections.length) {
            console.log("Not activating next user, as no pending connections");
            this.activeUserConnection = undefined;
            return;
        }

        console.log("Activating next user - " + Server.getConnectionIdentifier(this.pendingUserConnections[0]));

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
            connection.socket.emit(Events.setQueuePosition, Number(i) + 1);
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
        console.log("Dropping connection " + Server.getConnectionIdentifier(connection));

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

        console.log("Dropping user connection " + Server.getConnectionIdentifier(connection));

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
        this.hostConnections.push(connection);
    }

    get activeUserConnection(): UserConnection {
        return this._activeUserConnection;
    }

    set activeUserConnection(value: UserConnection) {
        this._activeUserConnection = value;
    }

    /**
     * @return {UserConnection[]}
     */
    get startedUserConnections(): UserConnection[] {
        return this._startedUserConnections;
    }

    public addStartedUserConnection(connection: UserConnection) {
        console.log("Adding user connection " + Server.getConnectionIdentifier(connection) + " to the started queue");
        this.startedUserConnections.push(connection);
        this.dumpStartedConnections();
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
        console.log("Adding user connection " + Server.getConnectionIdentifier(connection) + " to pending queue");
        this.pendingUserConnections.push(connection);
        this.updateQueuePositions();
        connection.socket.emit(Events.setState, States.pendingUser);

        if (undefined === this.activeUserConnection) {
            this.activateNextUser();
        }
    }

    set pendingUserConnections(value: UserConnection[]) {
        this._pendingUserConnections = value;
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Debugging methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Logs the current pending connection stack
     */
    private dumpStartedConnections() {
        console.log("Started connections...");
        for (let i in this.startedUserConnections) {
            console.log("#" + this.startedUserConnections[i].id);
        }
    }

    /**
     * Logs the current pending connection stack
     */
    private dumpPendingConnections() {
        console.log("Pending connections...");
        for (let i in this.pendingUserConnections) {
            console.log("#" + this.pendingUserConnections[i].id);
        }
    }

    /**
     * Returns a string containing the connection ID & user name
     *
     * @param {Connection} connection
     *
     * @return {string}
     */
    public static getConnectionIdentifier(connection: Connection): string {
        let returnString = "#" + connection.id;

        if (connection instanceof UserConnection) {
            returnString += "(" + connection.userName + ")";
        }

        return returnString;
    }
}