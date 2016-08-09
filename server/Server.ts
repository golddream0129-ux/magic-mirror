///<reference path="../typings/index.d.ts"/>

import * as core from "express-serve-static-core";
import * as express from "express";
import * as http from "http";
import * as socketIO from "socket.io";
import {Connection} from "../server/connection/Connection";

/**
 * Main node web server that handles client synchronisation
 */
export class Server {

    private _app: core.Express;
    private _server: http.Server;
    private _io: SocketIO.Server;

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
    };
}