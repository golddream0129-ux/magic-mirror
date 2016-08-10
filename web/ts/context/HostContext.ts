"use strict";

import * as Vue from "vue";
import {SleepScreen} from "../component/host/SleepScreen";
import {WelcomeScreen} from "../component/WelcomeScreen";
import {CategoriesScreen} from "../component/CategoriesScreen";
import {QuestionsScreen} from "../component/QuestionsScreen";
import {FortuneScreen} from "../component/FortuneScreen";
import {ClientContext} from "./ClientContext";
import {Events} from "../../../server/connection/Connection";

export class HostContext extends ClientContext {

    /**
     * Adds socket message event handlers
     *
     * @param {SocketIOClient.Socket} socket
     */
    protected addSocketEventHandlers(socket: SocketIOClient.Socket): void {
        this.setFriendlyName();
    }

    /**
     * Initialises the main Vue component
     *
     * @param {string} el Element selector
     */
    protected initialiseVue(el: string): void {
        this._vue = new Vue({
            el: el,
            data: {
                screen: HostScreen[HostScreen.Sleep],
                categories: this.categories,
                selectedCategory: null,
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

    /**
     * Adds event handlers for Vue
     */
    protected addVueEventHandlers(): void {
    }

    /**
     * Sets the connection friendly name, if available
     */
    private setFriendlyName() {
        if (window.location.hash) {
            this.emit(Events.ConnectionFriendlyName, window.location.hash);
        }
    }
}

export enum HostScreen {
    Sleep,
    Welcome,
    Categories,
    Questions,
    Fortune,
}