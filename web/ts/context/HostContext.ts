"use strict";

import * as Vue from "vue";
import {SleepScreen} from "../component/host/SleepScreen";
import {WelcomeScreen} from "../component/WelcomeScreen";
import {CategoriesScreen} from "../component/CategoriesScreen";
import {QuestionsScreen} from "../component/QuestionsScreen";
import {FortuneScreen} from "../component/FortuneScreen";
import {ClientContext, SharedScreen} from "./ClientContext";
import {Events} from "../../../server/connection/Connection";
import {LostUserScreen} from "../component/host/LostUserScreen";
import {CategoryList} from "./../App";
import {Fortune} from "../model/Fortune";

export class HostContext extends ClientContext {

    /**
     * Adds socket message event handlers
     *
     * @param {SocketIOClient.Socket} socket
     */
    protected addSocketEventHandlers(socket: SocketIOClient.Socket): void {
        this.setFriendlyName();

        // Also see ClientContext.addUniversalSocketHandlers()
        socket.on(Events.LostUser, this.lostUserHandler);
        socket.on(Events.CategorySelected, this.categorySelectedHandler);
        socket.on(Events.Answers, this.answersHandler);
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
                answers: {},
            },
            methods: {
                getCurrentQuestionNo: () => {
                    return this.getCurrentQuestionNo();
                },
                getCurrentQuestion: () => {
                    return this.getCurrentQuestion();
                },
                getFortune: (): Fortune => {
                    return this.getFortune(this._vue.$get("selectedCategory").name, this._vue.$get("answers"));
                },
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
    lostUserHandler = (): void => {
        console.log("Event: Events.LostUser");

        // If still waiting to be powered on by the user's dancing, don't wake up just to display the lost user message
        if (this._vue.$get("screen") === HostScreen[HostScreen.Sleep]) {
            return;
        }

        this._vue.$set("screen", HostScreen[HostScreen.LostUser]);
    };

    /**
     * Event: Events.CategorySelected
     */
    categorySelectedHandler = (categoryName: string): void => {
        console.log("Event: Events.CategorySelected", categoryName);

        let categories: CategoryList = this._vue.$get("categories");

        if (undefined === categories[categoryName]) {
            console.log("unable to find category selected");
        }

        this._vue.$set("selectedCategory", categories[categoryName]);

        this._vue.$set("screen", SharedScreen[SharedScreen.Questions]);
    };

    /**
     * Event: Events.Answers
     */
    answersHandler = (answerKeys: string[]): void => {
        console.log("Event: Events.Answers", answerKeys);

        this._vue.$set("answers", answerKeys);

        if (this.getAnswerCount() === this.getQuestionCount()) {
            this._vue.$set("screen", SharedScreen[SharedScreen.Fortune]);
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Helper methods
    // -----------------------------------------------------------------------------------------------------------------

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