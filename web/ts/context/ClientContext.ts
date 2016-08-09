"use strict";
import {App} from "../App";

export abstract class ClientContext {

    /**
     * @constructor
     * @param {App} _app
     */
    constructor(private _app: App) {
    }
}