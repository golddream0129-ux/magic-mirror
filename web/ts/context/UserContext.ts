import * as Vue from "vue";
import {ClientContext} from "./ClientContext";
import {QuestionsScreen} from "../component/QuestionsScreen";
import {CategoriesScreen} from "../component/CategoriesScreen";
import {FortuneScreen} from "../component/FortuneScreen";
import {EnterNameScreen} from "../component/user/EnterNameScreen";
import {ConnectingScreen} from "../component/user/ConnectingScreen";
import {ReadyScreen} from "../component/user/ReadyScreen";
import {PoweredByDanceScreen} from "../component/user/PoweredByDanceScreen";

export class UserContext extends ClientContext {

    /**
     * @type {vuejs.Vue}
     */
    private _vue: vuejs.Vue;

    /**
     * Initialises the main Vue component
     *
     * @param {string} el Element selector
     */
    protected init(el: string): void {

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

        this._vue.$watch("userName", function () {
            console.log("userName set to " + this.userName);
            console.log("switching screen to " + UserScreen[UserScreen.Connecting]);
            this.screen = UserScreen[UserScreen.Connecting];
        });
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