
"use strict";

import {Server} from "../Server";

export abstract class Connection {

    /**
     * Should return the type of the connection
     */
    abstract getType(): ConnectionType;

    constructor(private _server: Server, private _socket: SocketIO.Socket) {
        console.log("a " + this.getType() + " connected from " + _socket.client.conn.remoteAddress);
        _socket.emit("status", this.getType());
    }
}

export type ConnectionType = "host" | "user";