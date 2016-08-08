"use strict";

import {Server} from "../Server";

export abstract class Connection {

    public id: string;

    /**
     * Should return the type of the connection
     */
    abstract getType(): ConnectionType;

    abstract init(): void;

    /**
     * @constructor
     * @param {Server} _server
     * @param {SocketIO.Socket} _socket
     */
    constructor(private _server: Server, private _socket: SocketIO.Socket) {
        console.log("a " + this.getType() + " connected from " + _socket.client.conn.remoteAddress);

        this.id = _socket.client.conn.id;

        // @todo - Remove debugging line
        _socket.emit("id", this.id);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Getters & Setters
    // -----------------------------------------------------------------------------------------------------------------

    get server(): Server {
        return this._server;
    }

    get socket(): SocketIO.Socket {
        return this._socket;
    }
}

export type ConnectionType = "host" | "user";

export const Events = {
    connect: "connection",
    reset: "reset",
    setState: "setState",
    setUserName: "setUserName",
    setQueuePosition: "setQueuePosition",
    setCategory: "setCategory",
    setAnswer: "setAnswer",
    disconnect: "disconnect",
};

export const States = {
    host: "host",
    start: "user input",
    pendingUser: "pending user",
    activeUser: "active user",
    disconnected: "disconnected",
};