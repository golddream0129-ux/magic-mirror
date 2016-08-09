///<reference path="../typings/index.d.ts"/>

import * as core from "express-serve-static-core";
import * as express from "express";
import * as http from "http";
import * as socketIO from "socket.io";
import {Connection} from "../server/connection/Connection";
import {HostConnection} from "../server/connection/HostConnection";

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
        this._io.on("connection", this.newConnectionHandler);
    }

    newConnectionHandler = (socket: SocketIO.Socket) => {

        let connection: Connection;

        if ("localhost:3000" === socket.handshake.headers.host) {
            let hostConnection = new HostConnection(this, socket);
            this.addHostConnection(hostConnection);
            connection = hostConnection;
        } else {
            throw "Not written yet";
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Getters & Setters
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @return {HostConnectionCollection}
     */
    get hostConnections(): HostConnectionCollection {
        return this._hostConnections;
    }

    /**
     * Adds a host connection to the hash of host connections
     *
     * @param {HostConnection} connection
     */
    public addHostConnection(connection: HostConnection) {
        this.hostConnections[connection.id] = connection;
    }
}


interface HostConnectionCollection {
    [id: string]: HostConnection;
}