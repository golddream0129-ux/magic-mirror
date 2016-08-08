"use strict";
import {Connection, ConnectionType} from "./Connection";
import {Server} from "../Server";
import Socket = SocketIO.Socket;

/**
 * Connection from a user's device
 */
export class UserConnection extends Connection {

    getType(): ConnectionType {
        return "user";
    }

    /**
     * Override of Connection constructor to add '_active' property
     * @param {Server} _server
     * @param {Socket} _socket
     * @param {boolean} _active
     */
    constructor(private _server: Server, private _socket: SocketIO.Socket, private _active: boolean) {
        super(_server, _socket);
    }
}