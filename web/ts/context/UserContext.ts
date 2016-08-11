import * as Vue from "vue";
import {ClientContext, SharedScreen} from "./ClientContext";
import {QuestionsScreen} from "../component/QuestionsScreen";
import {CategoriesScreen} from "../component/CategoriesScreen";
import {FortuneScreen} from "../component/FortuneScreen";
import {EnterNameScreen} from "../component/user/EnterNameScreen";
import {ConnectingScreen} from "../component/user/ConnectingScreen";
import {ReadyScreen} from "../component/user/ReadyScreen";
import {PoweredByDanceScreen} from "../component/user/PoweredByDanceScreen";
import {Events} from "../../../server/Connection/Connection";
import {QueueingScreen} from "../component/user/QueueingScreen";
import {TimeoutScreen} from "../component/user/TimeoutScreen";
import {WelcomeScreen} from "../component/WelcomeScreen";
import {Category, CategoryQuestions} from "../model/Category";
import {QuestionAnswers} from "../model/Question";

export class UserContext extends ClientContext {

    /**
     * Adds socket message event handlers
     *
     * @param {SocketIOClient.Socket} socket
     */
    protected addSocketEventHandlers(socket: SocketIOClient.Socket): void {
        socket.on(Events.MirrorOffline, this.mirrorOfflineHandler);
        socket.on(Events.QueuePosition, this.queuePositionHandler);
        socket.on(Events.Ready, this.readyHandler);
        socket.on(Events.ReadyTimer, this.readyTimerHandler);
        socket.on(Events.Timeout, this.timeoutHandler);
        socket.on(Events.Activate, this.activateHandler);
    }

    /**
     * Initialises the Vue
     *
     * @param {string} el
     */
    protected initialiseVue(el: string) {
        this._vue = new Vue({
            el: el,
            data: {
                screen: UserScreen[UserScreen.EnterName],
                userName: null,
                queuePosition: 0,
                readyTimer: null,
                ready: null,
                categories: this.categories,
                selectedCategory: null,
                answers: {},
                mirrorOnline: true,
            },
            components: {
                EnterName: EnterNameScreen,
                Connecting: ConnectingScreen,
                Queueing: QueueingScreen,
                Ready: ReadyScreen,
                PoweredByDance: PoweredByDanceScreen,
                Welcome: WelcomeScreen,
                Categories: CategoriesScreen,
                Questions: QuestionsScreen,
                Fortune: FortuneScreen,
                Timeout: TimeoutScreen,
            }
        });
    }

    /**
     * Adds event handlers for Vue
     */
    protected addVueEventHandlers() {
        this._vue.$watch("userName", this.usernameUpdatedHandler);
        this._vue.$watch("ready", this.readyUpdatedHandler);
        this._vue.$watch("selectedCategory", this.selectedCategoryHandler);
        this._vue.$watch("answers", this.answersUpdatedHandler);

        this._vue.$watch("mirrorOnline", this.mirrorOnlineToggleHandler);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Event handlers
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Performs context specific reset tasks
     *
     * Called from parent class
     */
    contextSpecificReset(): void {
        this._vue.$set("userName", null);
        this._vue.$set("queuePosition", 0);
        this._vue.$set("readyTimer", null);
        this._vue.$set("ready", null);
        this._vue.$set("screen", UserScreen[UserScreen.EnterName]);
    };

    /**
     * Vue watch: userName
     *
     * @param {string} userName
     */
    usernameUpdatedHandler = (userName: string): void => {
        console.log("userName set to " + userName);

        console.log("switching screen to " + UserScreen[UserScreen.Connecting]);
        this._vue.$set("screen", UserScreen[UserScreen.Connecting]);

        console.log("setting connection friendly name");
        this.emit(Events.ConnectionFriendlyName, userName);

        this.emit(Events.JoinQueue);
    };

    /**
     * Vue watch: ready
     *
     * @param {boolean} ready
     */
    readyUpdatedHandler = (ready: boolean) => {
        console.log("ready set to " + ready);

        this.emit(Events.Ready, ready);
    };

    /**
     * Vue watch: selectedCategory
     *
     * @param {Category} category
     */
    selectedCategoryHandler = (category: Category) => {
        console.log("category " + category.name + " selected");
        this.emit(Events.CategorySelected, category.name);
        this._vue.$set("screen", SharedScreen[SharedScreen.Questions]);
    };

    /**
     * Vue watch: answers
     *
     * @param {QuestionAnswers} answers
     */
    answersUpdatedHandler = (answers: QuestionAnswers) => {
        console.log("answers updated", answers);

        this.emit(Events.Answers, answers);

        console.log("Complete UserContext.answersUpdatedHandler()");
    };

    /**
     * Vue watch: mirrorOnline
     *
     * @param {boolean} online
     */
    mirrorOnlineToggleHandler = (online: boolean): void => {
        if (!online) {
            this._vue.$set("screen", UserScreen[UserScreen.Connecting]);
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Socket message handlers
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Event: Events.QueuePosition
     */
    queuePositionHandler = (position: number) => {
        console.log("Event: Events.QueuePosition", position);
        this._vue.$set("queuePosition", position);
        this._vue.$set("screen", UserScreen[UserScreen.Queueing]);
    };

    /**
     * Event Events.Ready
     */
    readyHandler = () => {
        console.log("Event: Events.Ready");
        this._vue.$set("screen", UserScreen[UserScreen.Ready]);
    };

    /**
     * Event: Events.ReadyTimer
     */
    readyTimerHandler = (timer: number) => {
        console.log("Event: Events.ReadyTimer", timer);
        this._vue.$set("readyTimer", timer);
    };

    /**
     * Event: Events.Timeout
     */
    timeoutHandler = () => {
        console.log("Event: Events.Timeout");
        this._vue.$set("screen", UserScreen[UserScreen.Timeout]);
    };

    /**
     * Event: Events.Activate
     */
    activateHandler = (timeout: number) => {
        console.log("Event: Events.Activate", timeout);
        this._vue.$set("screen", UserScreen[UserScreen.PoweredByDance]);
    };

    /**
     * Event: Events.MirrorOffline
     */
    mirrorOfflineHandler = (): void => {
        console.log("Event: Events.MirrorOffline");

        this._vue.$set("mirrorOnline", false);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Helper methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Returns the questions for the currently selected category
     *
     * @return {CategoryQuestions}
     */
    getCategoryQuestions(): CategoryQuestions {
        let category = this._vue.$get("selectedCategory");
        if (!category || !category.questions) {
            console.error("Unable to find category questions");
            return;
        }
        return category.questions;
    }
}

export enum UserScreen {
    EnterName,
    Connecting,
    Queueing,
    Ready,
    PoweredByDance,
    Timeout,
}