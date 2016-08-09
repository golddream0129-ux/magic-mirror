"use strict";

import * as Vue from "vue";
import {SleepScreen} from "../component/host/SleepScreen";
import {WelcomeScreen} from "../component/host/WelcomeScreen";
import {CategoriesScreen} from "../component/CategoriesScreen";
import {QuestionsScreen} from "../component/QuestionsScreen";
import {FortuneScreen} from "../component/FortuneScreen";
import {ClientContext} from "./ClientContext";

export class HostContext extends ClientContext {

    /**
     * @type {vuejs.Vue}
     */
    private _vue: vuejs.Vue;

    /**
     * Initialises the main Vue component
     *
     * @param {string} el Element selector
     */
    init(el: string): void {
        this._vue = new Vue({
            el: el,
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
}

export enum HostScreen {
    Sleep,
    Welcome,
    Categories,
    Questions,
    Fortune,
}