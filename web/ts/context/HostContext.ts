"use strict";

import {App} from "../App";
import * as Vue from "vue";
import {SleepScreen} from "../component/host/SleepScreen";
import {WelcomeScreen} from "../component/host/WelcomeScreen";
import {CategoriesScreen} from "../component/CategoriesScreen";
import {QuestionsScreen} from "../component/QuestionsScreen";
import {FortuneScreen} from "../component/FortuneScreen";
import {ClientContext} from "./ClientContext";

export class HostContext extends ClientContext {

    private _vue: vuejs.Vue;

    /**
     * @constructor
     *
     * Initialises the Vue element
     *
     * @param {App} _app
     */
    constructor(private _app: App) {
        super(this.app);

        this._vue = new Vue({
            el: this.app.el,
            data: {
                screen: HostScreen[HostScreen.Sleep],
            },
            components: {
                Sleep: SleepScreen,
                Welcome: WelcomeScreen,
                Categories: CategoriesScreen,
                Questions: QuestionsScreen,
                Fortune: FortuneScreen,
            }
        });
    }


    get app(): App {
        return this._app;
    }
}

export enum HostScreen {
    Sleep,
    Welcome,
    Categories,
    Questions,
    Fortune,
}