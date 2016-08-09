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
        this.init(this.app.el);
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