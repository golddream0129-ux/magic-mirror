import {Server} from "../../server/Server";

/**
 * Base class for all socket connection types
 *
 * Connections handle sending & receiving of socket messages
 */
export abstract class Connection {

    private _id: string;

    /**
     * Friendly connection name
     */
    private _friendlyName: string;

    /**
     * Should return the type of the connection
     */
    abstract getType(): ConnectionType;

    /**
     * @constructor
     * @param {Server} _server
     * @param {SocketIO.Socket} _socket
     */
    constructor(private _server: Server, private _socket: SocketIO.Socket) {
        console.log("a " + this.getType() + " connected from " + _socket.client.conn.remoteAddress);

        this.id = _socket.client.conn.id;

        // @todo - Remove debugging line
        this.emit(Events.ID, this.id);
        this.emit(Events.ClientType, this.getType());

        this._socket.on(Events.ConnectionFriendlyName, this.setFriendlyNameHandler);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Passthru method for socket.emit()
     */
    public emit(...args) {
        this._socket.emit.apply(this._socket, args);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Event handlers
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Event: {Events.ConnectionFriendlyName}
     *
     * @param {string} name
     */
    setFriendlyNameHandler(name: string) {
        console.log("Setting friendly name (" + name + ") for connection " + this.id);
        this._friendlyName = name;
    }


    // -----------------------------------------------------------------------------------------------------------------
    // Getters & Setters
    // -----------------------------------------------------------------------------------------------------------------

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }
}

export type ConnectionType = "host" | "user";

export const Events = {
    Connect: "connection",
    ID: "id",
    ConnectionFriendlyName: "connectionName",
    ClientType: "clientType",
};