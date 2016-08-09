///<reference path="../../typings/index.d.ts"/>

import {Category} from "./model/Category";
import {Fortune} from "./model/Fortune";
import {ConnectionType, Events} from "../../server/Connection/Connection";
import {HostContext} from "./context/HostContext";
import {ClientContext} from "./context/ClientContext";

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
     * @type {CategoryList}
     * @private
     */
    private _categories: CategoryList = {};

    /**
     * @type {FortuneMatrix}
     */
    private _fortunes: FortuneMatrix;

    /**
     * @type {ClientContext}
     */
    private _context: ClientContext;

    // -----------------------------------------------------------------------------------------------------------------
    // Initialisation methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @constructor
     *
     * @param {string} _el
     */
    constructor(private _el: string) {

        this._socket = io();

        this.socket.on(Events.ClientType, (type: ConnectionType) => {
            console.log("Event: " + Events.ClientType, type);
            this.setContextFor(type);
        });
    }

    /**
     * Sets the context based on the connection type
     *
     * @param type
     */
    setContextFor(type: ConnectionType): void {
        console.log("Setting context for " + type);
        switch (type) {
            case "host":
                this._context = new HostContext(this._el, this._socket);
                return;
            default:
                throw "Unknown type - " + type;
        }

    }

    boot(): void {
        // If we haven't received the client type yet, loop until we have
        if (!this.context) {
            console.log("No client context yet");
            setTimeout(() => {
                this.boot();
            }, 100);
            return;
        }

        console.log("Booted!");
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Data setting methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Adds a category to the available categories
     *
     * @param category
     */
    public addCategory(category: Category): void {
        this.categories[category.name] = category;
    }

    /**
     * Adds a fortune to the fortuens matrix
     *
     * @param {string} categoryName
     * @param {Fortune} fortune
     */
    public addFortune(categoryName: string, fortune: Fortune) {
        this._fortunes = this._fortunes || {};
        this._fortunes[categoryName] = this._fortunes[categoryName] || {};
        this._fortunes[categoryName][fortune.answer1] = this._fortunes[categoryName][fortune.answer1] || {};
        this._fortunes[categoryName][fortune.answer1][fortune.answer2] = this._fortunes[categoryName][fortune.answer1][fortune.answer2] || {};

        this._fortunes[categoryName][fortune.answer1][fortune.answer2][fortune.answer3] = fortune;
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
     * @return {ClientContext}
     */
    get context(): ClientContext {
        return this._context;
    }

    /**
     * @return {CategoryList}
     */
    get categories(): CategoryList {
        return this._categories;
    }
}

interface CategoryList {
    [name: string]: Category;
}

interface FortuneMatrix {
    [category: string]: {
        [answer1: string]: {
            [answer2: string]: {
                [answer3: string]: Fortune
            }
        }
    };
}