import {CategoryList} from "../App";
import {Events} from "../../../server/Connection/Connection";

/**
 * Base client context class to extend other types from
 */
export abstract class ClientContext {

    /**
     * @type {vuejs.Vue}
     */
    protected _vue: vuejs.Vue;

    // -----------------------------------------------------------------------------------------------------------------
    // Initialisation methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @constructor
     * @param {string} _el
     * @param {SocketIOClient.Socket} _socket
     * @param _categories
     */
    constructor(private _el: string, private _socket: SocketIOClient.Socket, private _categories: CategoryList) {
    }

    /**
     * Initialises the main Vue component
     */
    public init(): void {
        this.addUniversalSocketHandlers(this._socket);
        this.addSocketEventHandlers(this._socket);
        this.initialiseVue(this._el);
        this.addVueEventHandlers();
    }

    /**
     * Adds handlers relevant to all context types
     *
     * @param {SocketIOClient.Socket} socket
     */
    private addUniversalSocketHandlers(socket: SocketIOClient.Socket) {
        socket.on(Events.Welcome, this.welcomeHandler);
        socket.on(Events.Categories, this.categoriesHandler);
    }

    /**
     * Should add socket message event handlers
     *
     * @param {SocketIOClient.Socket} socket
     */
    protected abstract addSocketEventHandlers(socket: SocketIOClient.Socket): void;

    /**
     * Should initialise the Vue
     *
     * @param {string} el Element selector string
     */
    protected abstract initialiseVue(el: string): void;

    /**
     * Should add event handlers for Vue
     */
    protected abstract addVueEventHandlers(): void;

    // -----------------------------------------------------------------------------------------------------------------
    // Event handlers
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Event: Events.Welcome
     */
    welcomeHandler = (timeout: number) => {
        console.log("Event: Events.Welcome", timeout);
        this._vue.$set("screen", SharedScreen[SharedScreen.Welcome]);
    };

    /**
     * Event: Events.Categories
     */
    categoriesHandler = () => {
        console.log("Event: Events.Categories");
        this._vue.$set("screen", SharedScreen[SharedScreen.Categories]);
    };

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
        this._socket.emit.apply(this._socket, args);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Getters & Setters
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @return {CategoryList}
     */
    get categories(): CategoryList {
        return this._categories;
    }
}

export enum SharedScreen {
    Welcome,
    Categories,
    Questions,
    Fortune,
}