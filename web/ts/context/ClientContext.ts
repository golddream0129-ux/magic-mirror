/**
 * Base client context class to extend other types from
 */
export abstract class ClientContext {

    // -----------------------------------------------------------------------------------------------------------------
    // Initialisation methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @constructor
     * @param {string} _el
     * @param {SocketIOClient.Socket} _socket
     */
    constructor(private _el: string, private _socket: SocketIOClient.Socket) {
        this.init(this._el);
    }

    /**
     * Should initialise the main Vue component
     *
     * @param {string} el Element selector
     */
    protected abstract init(el: string): void;

    // -----------------------------------------------------------------------------------------------------------------
    // Event handlers
    // -----------------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------------------
    // Helper methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Send message to socket connection
     *
     * @param args
     */
    public emit(...args: any[]) {
        console.log("Triggering: " + args[0], args.slice(1));
        this._socket.emit.apply(null, args);
    }
}