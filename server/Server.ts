///<reference path="../typings/index.d.ts"/>

import * as core from "express-serve-static-core";
import * as express from "express";
import * as http from "http";
import * as socketIO from "socket.io";
import {Connection} from "../server/connection/Connection";
import {HostConnection} from "../server/connection/HostConnection";
import {Events} from "./connection/Connection";
import {UserConnection} from "./connection/UserConnection";

/**
 * Main node web server that handles client synchronisation
 */
export class Server {

    private _app: core.Express;
    private _server: http.Server;
    private _io: SocketIO.Server;

    /**
     *
     * @type {HostConnectionCollection}
     * @private
     */
    private _hostConnections: HostConnectionCollection = {};

    /**
     *
     * @type {UserConnectionCollection}
     * @private
     */
    private _newUserConnections: UserConnectionCollection = {};

    /**
     * @type UserConnection[]
     * @private
     */
    private _queuedUserConnections: UserConnection[] = [];

    /**
     * Pointer used to indicate which user is currently being asked if they're ready
     */
    private _askingUserPointer;

    /**
     * @type UserConnection
     * @private
     */
    private _activeUserConnection: UserConnection;

    /**
     * Timeout
     */
    private _requestNextUserTimeout;

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

    /**
     * Starts the server listing on port 3000
     */
    public listen() {
        this._server.listen(3000, function () {
            console.log("listening on *:3000");
        });
    }

    /**
     * Adds static routes
     */
    addStaticFileHandler(): void {

        let staticServer: core.Handler = express.static(__dirname + "/../web");

        // noinspection TypeScriptValidateTypes
        this._app.use(staticServer);
    }

    /**
     * Adds handlers for socket
     */
    addSocketConnectionHandler(): void {
        this._io.on(Events.Connect, this.newConnectionHandler);
    }

    /**
     * Handles all new connections
     * @param socket
     */
    newConnectionHandler = (socket: SocketIO.Socket) => {

        let connection: Connection;

        if ("localhost:3000" === socket.handshake.headers.host) {
            let hostConnection = new HostConnection(this, socket);
            this.addHostConnection(hostConnection);
            connection = hostConnection;
        } else {
            let userConnection = new UserConnection(this, socket);
            this.addNewUserConnection(userConnection);
            connection = userConnection;
        }

        connection.init();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // User management methods
    // -----------------------------------------------------------------------------------------------------------------

    private updateUsersQueuePosition(connection?: UserConnection): void {
        for (let i in this._queuedUserConnections) {
            if (!connection || connection === this._queuedUserConnections[i]) {
                this._queuedUserConnections[i].emit(Events.QueuePosition, Number(i) + 1);
            }
        }
    }

    /**
     * Activates the next user
     */
    private offerToNextUser() {

        // Wait till the last offer has expired
        if (this._requestNextUserTimeout) {
            return;
        }

        // Do nothing if there aren't any queued users
        if (!this._queuedUserConnections.length) {
            return;
        }


        if (undefined === this._askingUserPointer) {
            this._askingUserPointer = 0;
        } else {
            this._askingUserPointer++;
        }

        let nextUserConnection = this._queuedUserConnections[this._askingUserPointer];

        if (nextUserConnection) {
            console.log("offering turn to user at position " + this._askingUserPointer + " - " + nextUserConnection.getIdentifierString());
            nextUserConnection.emit(Events.Ready);

            this._requestNextUserTimeout = setTimeout(() => {
                this.updateUsersQueuePosition(nextUserConnection);
                this._requestNextUserTimeout = undefined;
                this.offerToNextUser();
            }, 5000);

            return;
        }

        // Clear the counter & start again from the beginning
        this._askingUserPointer = undefined;
        this.offerToNextUser();
    }

    /**
     *
     * @param {UserConnection} connection
     * @param {boolean} ready
     */
    public userReady(connection: UserConnection, ready: boolean) {


        if (connection !== this._queuedUserConnections[this._askingUserPointer]) {
            console.log("ignoring ready request as not from the user under offer");
        }

        console.log("user " + (ready ? "" : "not " ) + "ready");

        // Either way, clear the timeout.  We'll handle things manually from here
        clearTimeout(this._requestNextUserTimeout);

        // Offer to the next user
        if (!ready) {
            this.offerToNextUser();
        }

        this.activateUserConnection(connection);
    }

    /**
     * Activates the user
     *
     * @param {UserConnection} connection
     */
    private activateUserConnection(connection: UserConnection) {
        this.removeQueuedUserConnection(connection);
        this._activeUserConnection = connection;
        connection.emit(Events.Activate);

        this.updateUsersQueuePosition();
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Helper methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Emits the give event to all user connections
     *
     * @param args
     */
    emitToAllUsers(...args: any[]) {
        console.log("emitting " + args[0] + " to all users", args.slice(1));
        console.log(this._queuedUserConnections.length);
        if (this._activeUserConnection) {
            this._activeUserConnection.emit.apply(this._activeUserConnection, args);
        }
        for (let i = 0; i < this._queuedUserConnections.length; i++) {
            let userConnection = this._queuedUserConnections[i];
            userConnection.emit.apply(userConnection, args);
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Getters & Setters
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Adds a host connection to the hash of host connections
     *
     * @param {HostConnection} connection
     */
    public addHostConnection(connection: HostConnection) {
        console.log("adding host connection " + connection.getIdentifierString());
        this._hostConnections[connection.id] = connection;

        // If this is the first host, let waiting clients know
        if (1 === Object.keys(this._hostConnections).length) {
            this.offerToNextUser();
        }
    }

    /**
     * Adds a user connection to the hash of new user connections
     *
     * @param {UserConnection} connection
     */
    public addNewUserConnection(connection: UserConnection) {
        console.log("adding new user connection " + connection.getIdentifierString());
        this._newUserConnections[connection.id] = connection;
    }

    /**
     * Adds a user connection to the hash of new user connections
     *
     * @param {UserConnection} connection
     */
    public addQueuedUserConnection(connection: UserConnection) {
        console.log("removing connection " + connection.getIdentifierString() + " from new user connections");
        delete this._newUserConnections[connection.id];
        console.log("adding connection " + connection.getIdentifierString() + " to. user queue");
        this._queuedUserConnections.push(connection);

        console.log(Object.keys(this._hostConnections));
        if (!Object.keys(this._hostConnections).length) {
            connection.emit(Events.MirrorOffline);
            return;
        }

        this.updateUsersQueuePosition(connection);

        if (!this._activeUserConnection) {
            this.offerToNextUser();
        }
    }

    /**
     * Removes a user conenction from the queue
     *
     * @param {UserConnection} connection
     */
    public removeQueuedUserConnection(connection: UserConnection) {
        console.log("attempting to remove user from queue - " + connection.getIdentifierString());
        for (let i = this._queuedUserConnections.length - 1; i >= 0; i--) {
            console.log("i: " + i);
            if (this._queuedUserConnections[i] === connection) {
                console.log("Found & removed ");
                this._queuedUserConnections.splice(i, 1);
            }
        }
    }

    /**
     * Drops a connection
     *
     * @param {Connection} connection
     */
    disconnectionConnection(connection: Connection) {
        if (connection instanceof HostConnection) {
            this.dropHostConnection(connection);
        } else if (connection instanceof UserConnection) {
            this.dropUserConnection(connection);
        } else {
            throw "Unknown connection type";
        }

        // Terminate the connection to be sure
        connection.disconnect();
    }

    /**
     * Drops a host connection
     *
     * @param {HostConnection} connection
     */
    private dropHostConnection(connection: HostConnection) {
        console.log("dropping host connection " + connection.getIdentifierString());
        delete this._hostConnections[connection.id];
        this.dumpHostConnections();

        if (!Object.keys(this._hostConnections).length) {
            this.emitToAllUsers(Events.MirrorOffline);

            // And move the active user back onto the top of queue
            this._queuedUserConnections.unshift(this._activeUserConnection);
            this._activeUserConnection = undefined;
        }
    }

    /**
     * Drops a user connection
     *
     * @param {UserConnection} connection
     */
    private dropUserConnection(connection: UserConnection) {
        console.log("dropping user connection " + connection.getIdentifierString());

        // Remove from new cuser connections
        if (this._newUserConnections[connection.id]) {
            delete this._newUserConnections[connection.id];
        }
        this.dumpNewUserConnections();

        // Remove from queued user connections
        this.removeQueuedUserConnection(connection);
        this.dumpQueuedUserConnections();

        if (this._activeUserConnection === connection) {
            this._activeUserConnection = undefined;
            this.offerToNextUser();
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Debugging methods
    // -----------------------------------------------------------------------------------------------------------------

    public dumpAllQueues(): void {
        this.dumpHostConnections();
        this.dumpNewUserConnections();
        this.dumpQueuedUserConnections();
        this.dumpActiveUserConnection();
    }

    /**
     * Logs the current pending connection stack
     */
    private dumpHostConnections() {

        let connectionCount: number = Object.keys(this._hostConnections).length;

        console.log("Host connections (" + connectionCount + ")...");

        if (!connectionCount) {
            console.log("  [None]");
            return;
        }

        for (let i in this._hostConnections) {
            console.log("  " + this._hostConnections[i].getIdentifierString());
        }
    }

    /**
     * Logs the current pending connection stack
     */
    private dumpNewUserConnections() {

        let connectionCount: number = Object.keys(this._newUserConnections).length;

        console.log("New user connections (" + connectionCount + ")...");

        if (!connectionCount) {
            console.log("  [None]");
            return;
        }

        for (let i in this._newUserConnections) {
            console.log("  " + this._newUserConnections[i].getIdentifierString());
        }
    }

    /**
     * Logs the current pending connection stack
     */
    private dumpQueuedUserConnections() {

        let connectionCount: number = Object.keys(this._queuedUserConnections).length;

        console.log("Queued user connections (" + connectionCount + ")...");

        if (!connectionCount) {
            console.log("  [None]");
            return;
        }

        for (let i in this._queuedUserConnections) {
            console.log("  " + this._queuedUserConnections[i].getIdentifierString());
        }
    }

    /**
     * Logs the current pending connection stack
     */
    private dumpActiveUserConnection() {

        let connectionCount: number = Object.keys(this._queuedUserConnections).length;

        console.log("Active user connection...");

        if (!this._activeUserConnection) {
            console.log("  [None]");
            return;
        }

        console.log("  " + this._activeUserConnection.getIdentifierString());
    }
}


interface HostConnectionCollection {
    [id: string]: HostConnection;
}

interface UserConnectionCollection {
    [id: string]: UserConnection;
}