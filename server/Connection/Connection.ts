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
    constructor(protected _server: Server, private _socket: SocketIO.Socket) {
        console.log("a " + this.getType() + " connected from " + _socket.client.conn.remoteAddress);

        this._id = _socket.client.conn.id;

        this._socket.on(Events.Disconnect, () => {
            this._server.disconnectionConnection(this);
        });

        this.emit(Events.ClientType, this.getType(), this.id);
    }


    public init(): void {

        this._socket.on(Events.ConnectionFriendlyName, this.setFriendlyNameHandler);

        this.addHandlers(this._socket);
    }

    /**
     * Should implement all connection type specific handlers
     *
     * @param {SocketIO.Socket} socket
     */
    protected abstract addHandlers(socket: SocketIO.Socket);

    /**
     * Disconnects the socket connection
     */
    public disconnect(): void {
        this._socket.disconnect(true);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Passthru method for socket.emit()
     */
    public emit(...args) {
        console.log("Triggering: " + args[0], args.slice(1));
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
    setFriendlyNameHandler = (name: string): void => {
        console.log("Setting friendly name (" + name + ") for connection " + this._id);
        this._friendlyName = name;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Getters & Setters
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    get id(): string {
        return this._id;
    }

    /**
     * Returns the connection friendly name, if available, otherwise returns the conneciton ID
     *
     * @return {string}
     */
    getIdentifierString(): string {
        if (this._friendlyName) {
            return this._friendlyName;
        }

        return this._id;
    }
}

export type ConnectionType = "host" | "user";

export const Events = {
    Connect: "connection",
    ID: "id",
    ConnectionFriendlyName: "connectionName",
    ClientType: "clientType",
    JoinQueue: "joinQueue",
    Activate: "activate",
    MirrorOffline: "mirrorOffline",
    Disconnect: "disconnect",
};