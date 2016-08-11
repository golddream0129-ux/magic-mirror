import {CategoryList, FortuneMatrix} from "../App";
import {Events} from "../../../server/Connection/Connection";
import {Category} from "../model/Category";
import {Question} from "../model/Question";
import {Fortune} from "../model/Fortune";

/**
 * Base client context class to extend other types from
 */
export abstract class ClientContext {

    /**
     * @type {vuejs.Vue}
     */
    protected _vue: vuejs.Vue;

    /**
     * While true, don't emit messages to server
     *
     * @type {boolean}
     */
    private _muteEmits: boolean;

    // -----------------------------------------------------------------------------------------------------------------
    // Initialisation methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @constructor
     * @param {string} _el
     * @param {SocketIOClient.Socket} _socket
     * @param {CategoryList} _categories
     * @param {FortuneMatrix} _fortunes
     */
    constructor(private _el: string, private _socket: SocketIOClient.Socket, private _categories: CategoryList, private _fortunes: FortuneMatrix) {
    }

    /**
     * Initialises the main Vue component
     */
    public init(): void {
        this.addUniversalSocketHandlers(this._socket);
        this.addSocketEventHandlers(this._socket);
        this.initialiseVue(this._el);
        this.addVueEventHandlers();
    }

    /**
     * Adds handlers relevant to all context types
     *
     * @param {SocketIOClient.Socket} socket
     */
    private addUniversalSocketHandlers(socket: SocketIOClient.Socket) {
        socket.on(Events.Reset, this.resetHandler);
        socket.on(Events.Welcome, this.welcomeHandler);
        socket.on(Events.Categories, this.categoriesHandler);
    }

    /**
     * Should add socket message event handlers
     *
     * @param {SocketIOClient.Socket} socket
     */
    protected abstract addSocketEventHandlers(socket: SocketIOClient.Socket): void;

    /**
     * Should initialise the Vue
     *
     * @param {string} el Element selector string
     */
    protected abstract initialiseVue(el: string): void;

    /**
     * Should add event handlers for Vue
     */
    protected abstract addVueEventHandlers(): void;

    // -----------------------------------------------------------------------------------------------------------------
    // Vue data helpers
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Gets the question count for the current category
     *
     * @return {number}
     */
    protected getQuestionCount(): number {
        let category: Category = this._vue.$get("selectedCategory");

        if (!category) {
            return 0;
        }

        return Object.keys(category.questions).length;
    }

    /**
     * Gets the answer count
     *
     * @return {number}
     */
    protected getAnswerCount(): number {
        return Object.keys(this._vue.$get("answers")).length;
    }

    /**
     * Returns the current question number based on the number of answers
     *
     * @return {number}
     */
    protected getCurrentQuestionNo(): number {
        return this.getAnswerCount() + 1;
    }

    /**
     * Returns the current question based on the existing answers
     *
     * @return {any}
     */
    protected getCurrentQuestion(): Question {
        let questions = this._vue.$get("selectedCategory").questions;
        let currentQuestionNo = this.getCurrentQuestionNo();

        return questions[currentQuestionNo];
    }

    public getFortune(categoryName: string, answers: {answer1: string, answer2: string, answer3: string}): Fortune {
        return this._fortunes[categoryName][answers[1]][answers[2]][answers[3]];
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Event handlers
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Event: Events.Reset
     *
     * Resets common context data.  You should override & super.reset() to clear context specific data & perform other
     * tasks
     */
    resetHandler = ()  => {
        console.log("Event: Events.Reset");

        // Don't trigger server updates for changes to selected category / answers change
        this._muteEmits = true;

        this._vue.$set("selectedCategory", null);
        this._vue.$set("answers", {});

        // Re-enable emits
        this._muteEmits = false;

        this.contextSpecificReset();
    };

    /**
     * Performs context specific reset tasks
     */
    protected abstract contextSpecificReset();

    /**
     * Event: Events.Welcome
     */
    welcomeHandler = (timeout: number) => {
        console.log("Event: Events.Welcome", timeout);
        this._vue.$set("screen", SharedScreen[SharedScreen.Welcome]);
    };

    /**
     * Event: Events.Categories
     */
    categoriesHandler = () => {
        console.log("Event: Events.Categories");
        this._vue.$set("screen", SharedScreen[SharedScreen.Categories]);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Helper methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Send message to socket connection
     *
     * @param args
     */
    public emit(...args: any[]) {
        if (this._muteEmits) {
            console.log("Not emitting, as muted");
        }

        console.log("Triggering: " + args[0], args.slice(1));
        this._socket.emit.apply(this._socket, args);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Getters & Setters
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @return {CategoryList}
     */
    get categories(): CategoryList {
        return this._categories;
    }
}

export enum SharedScreen {
    Welcome,
    Categories,
    Questions,
    Fortune,
}