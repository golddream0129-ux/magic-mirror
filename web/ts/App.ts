///<reference path="../../typings/index.d.ts"/>

/**
 * Main client side App class
 *
 * Handles instantiating applicaiton
 */
export class App {

    /**
     * @type {SocketIOClient.Socket}
     * @private
     */
    private _socket: SocketIOClient.Socket;

    /**
     * @constructor
     *
     * @param {string} _el
     */
    constructor(private _el: string) {
        this.socket = io();
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Getters & Setters
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    get el(): string {
        return this._el;
    }

    /**
     * @return {SocketIOClient.Socket}
     */
    get socket(): SocketIOClient.Socket {
        return this._socket;
    }

    /**
     * @param {SocketIOClient.Socket} value
     */
    set socket(value: SocketIOClient.Socket) {
        this._socket = value;
    }
}