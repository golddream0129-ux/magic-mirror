"use strict";

import * as Vue from "vue";
import {SleepScreen} from "../component/host/SleepScreen";
import {WelcomeScreen} from "../component/WelcomeScreen";
import {CategoriesScreen} from "../component/CategoriesScreen";
import {QuestionsScreen} from "../component/QuestionsScreen";
import {FortuneScreen} from "../component/FortuneScreen";
import {ClientContext} from "./ClientContext";
import {Events} from "../../../server/connection/Connection";
import {LostUserScreen} from "../component/host/LostUserScreen";

export class HostContext extends ClientContext {

    /**
     * Adds socket message event handlers
     *
     * @param {SocketIOClient.Socket} socket
     */
    protected addSocketEventHandlers(socket: SocketIOClient.Socket): void {
        this.setFriendlyName();

        socket.on(Events.LostUser, this.lostUser);
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
                currentQuestionNo: null,
                answers: {},
            },
            components: {
                Sleep: SleepScreen,
                Welcome: WelcomeScreen,
                Categories: CategoriesScreen,
                Questions: QuestionsScreen,
                Fortune: FortuneScreen,
                LostUser: LostUserScreen,
            }
        });
    }

    /**
     * Adds event handlers for Vue
     */
    protected addVueEventHandlers(): void {
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Socket event handlers
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Performs context specific reset tasks
     *
     * Called from parent class
     */
    contextSpecificReset(): void {
        this._vue.$set("screen", HostScreen[HostScreen.Sleep]);
    };

    /**
     * Event: Events.LostUser
     */
    lostUser = (): void => {
        console.log("Event: Events.LostUser");

        // If still waiting to be powered on by the user's dancing, don't wake up just to display the lost user message
        if (this._vue.$get("screen") === HostScreen[HostScreen.Sleep]) {
            return;
        }

        this._vue.$set("screen", HostScreen[HostScreen.LostUser]);
    };

    /**
     * Sets the connection friendly name, if available
     */
    private setFriendlyName(): void {
        if (window.location.hash) {
            this.emit(Events.ConnectionFriendlyName, window.location.hash);
        }
    }
}

export enum HostScreen {
    Sleep,
    LostUser,
}