///<reference path="../../typings/index.d.ts"/>

import {Category} from "./model/Category";
import {Fortune} from "./model/Fortune";

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
    private _fortunes;

    /**
     * @constructor
     *
     * @param {string} _el
     */
    constructor(private _el: string) {
        this.socket = io();
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
        this.fortunes[categoryName] = this.fortunes[categoryName] || {};
        this.fortunes[categoryName][fortune.answer1] = this.fortunes[categoryName][fortune.answer1] || {};
        this.fortunes[categoryName][fortune.answer1][fortune.answer2] = this.fortunes[categoryName][fortune.answer1][fortune.answer2] || {};

        this.fortunes[categoryName][fortune.answer1][fortune.answer2][fortune.answer3] = fortune;
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


    get categories(): CategoryList {
        return this._categories;
    }

    /**
     * @return {FortuneMatrix}
     */
    get fortunes() {
        return this._fortunes;
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