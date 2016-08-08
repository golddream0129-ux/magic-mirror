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

        this.socket.on(Events.setCategory, this.server.setCategory);
        this.socket.on(Events.setAnswer, this.server.setAnswer);
        this.socket.on(Events.disconnect, this.disconnect);

        this.socket.emit(Events.setState, States.start);
    }

    /**
     * Returns the connection type friendly name
     *
     * @return {ConnectionType}
     */
    getType(): ConnectionType {
        return "user";
    }

    public start(): void {
        this.socket.emit(Events.setState, States.start);
    }

    public activate(): void {
        this.active = true;
        this.socket.emit(Events.setState, States.activeUser);
    }

    public disconnect = () => {
        this.server.dropConnection(this);
    };

    set active(value: boolean) {
        this._active = value;
    }
}