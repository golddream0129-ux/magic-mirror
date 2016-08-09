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
        this._newUserConnections[connection.id] = undefined;
        console.log("adding connection " + connection.getIdentifierString() + " to. user queue");
        this._queuedUserConnections.push(connection);

        console.log(Object.keys(this._hostConnections));
        if (!Object.keys(this._hostConnections).length) {
            connection.emit(Events.MirrorOffline);
            return;
        }
    }
}


interface HostConnectionCollection {
    [id: string]: HostConnection;
}

interface UserConnectionCollection {
    [id: string]: UserConnection;
}