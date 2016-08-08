
"use strict";

import {Server} from "../Server";

export abstract class Connection {

    /**
     * Should return the type of the connection
     */
    abstract getType(): ConnectionType;

    constructor(private _server: Server, private _socket: SocketIO.Socket) {
        console.log("a " + this.getType() + " connected from " + _socket.client.conn.remoteAddress);
        this.socket.emit(Events.updateStatus, "host");
    }

    get server(): Server {
        return this._server;
    }

    get socket(): SocketIO.Socket {
        return this._socket;
    }
}

export type ConnectionType = "host" | "user";

export const Events = {
    updateStatus: "updateStatus",
};