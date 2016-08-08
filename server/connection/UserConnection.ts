"use strict";
import {Connection, ConnectionType, Events, States} from "./Connection";
import Socket = SocketIO.Socket;
import {Server} from "../Server";

/**
 * Connection from a user's device
 */
export class UserConnection extends Connection {

    /**
     * User's name
     */
    private _userName: string;

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

        this.socket.on(Events.setUserName, this.setUserName);
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

    public setUserName = (userName: string) => {
        console.log("Setting user name to " + userName + " on connection " + Server.getConnectionIdentifier(this));
        this.userName = userName;
        this.server.addUserConnectionToQueue(this);
    };

    public activate(): void {
        this.active = true;
        this.socket.emit(Events.setState, States.activeUser);
    }

    public disconnect = () => {
        this.server.dropConnection(this);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Getters & Setters
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    get userName(): string {
        return this._userName;
    }

    /**
     * @param {string} value
     */
    set userName(value: string) {
        this._userName = value;
    }

    /**
     * @param {boolean} value
     */
    set active(value: boolean) {
        this._active = value;
    }
}