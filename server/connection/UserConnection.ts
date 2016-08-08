"use strict";
import {Connection, ConnectionType, Events} from "./Connection";
import Socket = SocketIO.Socket;

/**
 * Connection from a user's device
 */
export class UserConnection extends Connection {

    private _active: boolean = false;

    getType(): ConnectionType {
        return "user";
    }

    activate(): void {
        this.active = true;
        this.socket.emit(Events.updateStatus, "active user");
    }

    set active(value: boolean) {
        this._active = value;
    }
}