import * as Vue from "vue";
import {ClientContext} from "./ClientContext";
import {QuestionsScreen} from "../component/QuestionsScreen";
import {CategoriesScreen} from "../component/CategoriesScreen";
import {FortuneScreen} from "../component/FortuneScreen";
import {EnterNameScreen} from "../component/user/EnterNameScreen";
import {ConnectingScreen} from "../component/user/ConnectingScreen";
import {ReadyScreen} from "../component/user/ReadyScreen";
import {PoweredByDanceScreen} from "../component/user/PoweredByDanceScreen";
import {Events} from "../../../server/Connection/Connection";

export class UserContext extends ClientContext {

    /**
     * @type {vuejs.Vue}
     */
    private _vue: vuejs.Vue;

    /**
     * Adds socket message event handlers
     */
    protected addSocketEventHandlers() {
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
            },
            components: {
                EnterName: EnterNameScreen,
                Connecting: ConnectingScreen,
                Ready: ReadyScreen,
                PoweredByDance: PoweredByDanceScreen,
                Categories: CategoriesScreen,
                Questions: QuestionsScreen,
                Fortune: FortuneScreen,
            }
        });
    }

    /**
     * Adds event handlers for Vue
     */
    protected addVueEventHandlers() {
        // We use the arrow function here, as init is called within constructor, so class arrow methods are not setup
        // yet
        this._vue.$watch("userName", (userName: string) => {
            this.usernameUpdatedHandler(userName);
        });
    }

    /**
     * Vue watch: userName
     *
     * @param {string} userName
     */
    usernameUpdatedHandler(userName: string): void {
        console.log("userName set to " + userName);

        console.log("switching screen to " + UserScreen[UserScreen.Connecting]);
        this._vue.$set("screen", UserScreen[UserScreen.Connecting]);

        console.log("setting connection friendly name");
        this.emit(Events.ConnectionFriendlyName, userName);

        this.emit(Events.JoinQueue);
    }
}

export enum UserScreen {
    EnterName,
    Connecting,
    Ready,
    PoweredByDance,
    Categories,
    Questions,
    Fortune,
}