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

    /**
     * @return {App}
     */
    get app(): App {
        return this._app;
    }
}