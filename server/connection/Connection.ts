"use strict";

import {Server} from "../Server";

export abstract class Connection {

    /**
     * Should return the type of the connection
     */
    abstract getType(): ConnectionType;

    abstract init(): void;

    constructor(private _server: Server, private _socket: SocketIO.Socket) {
        console.log("a " + this.getType() + " connected from " + _socket.client.conn.remoteAddress);

        this.init();
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
    setState: "setState",
};

export const States = {
    host: "host",
    activeUser: "active user",
    pendingUser: "pending user",
    disconnected: "disconnected",
};