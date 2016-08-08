"use strict";
import {Connection, ConnectionType, Events, States} from "./Connection";
import Socket = SocketIO.Socket;

/**
 * Connection from a user's device
 */
export class UserConnection extends Connection {

    /**
     * Flag to indicate whether this conneciton is the active user
     *
     * @type {boolean}
     * @private
     */
    private _active: boolean = false;

    /**
     * Sets the state of the client to 'host'
     */
    init(): void {
        this.socket.on("disconnect", this.disconnect);

        this.socket.emit(Events.setState, States.pendingUser);
    }

    /**
     * Returns the connection type friendly name
     *
     * @return {ConnectionType}
     */
    getType(): ConnectionType {
        return "user";
    }

    activate(): void {
        this.active = true;
        this.socket.emit(Events.setState, States.activeUser);
    }

    disconnect = () => {
        this.server.dropConnection(this);
    };

    set active(value: boolean) {
        this._active = value;
    }
}