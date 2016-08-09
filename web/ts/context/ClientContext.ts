import {App} from "../App";

/**
 * Base client context class to extend other types from
 */
export abstract class ClientContext {

    /**
     * @constructor
     * @param {App} _app
     */
    constructor(private _app: App) {
    }
}