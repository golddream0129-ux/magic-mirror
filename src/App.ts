"use strict";

import {Category} from "./model/Category";
import {Answer} from "./model/Answer";
import {Fortune} from "./model/Fortune";
import Socket = SocketIOClient.Socket;

let Vue = require("../node_modules/vue/dist/vue");

export const PAGE_CATEGORY_SELECT = "categorySelect";
export const PAGE_QUESTION_ASKER = "questionAsker";

/**
 * Main App class
 */
export class App {
    public static registerComponents() {
        require("./component/CategorySelectorComponent");
        require("./component/QuestionAskerComponent");
        require("./component/FortuneComponent");
        require("./component/CategoryIconComponent");
    }

    private socket: Socket;

    private _vue: vuejs.Vue;

    private _categories: CategoryList = {};

    private _fortunes = [];

    // private _currentCategory: Category;
    //
    // private _currentQuestionNo: number;

    /**
     * @constructor
     *
     * @param el
     */
    constructor(private el: string) {
        App.registerComponents();
    }

    /**
     * Boots the app
     */
    boot(): void {
        this.socket = io();

        this.initializeVue();

        this.socket.on("reset", this.reset);
        this.socket.on("setCategory", this.setCategory);
        this.socket.on("setAnswer", this.setAnswer);
    }

    private initializeVue() {

        this._vue = new Vue({
            el: this.el,
            data: {
                app: this,
                page: PAGE_CATEGORY_SELECT,
                currentCategory: null,
                currentQuestionNo: null,
                answers: {},
            },
            methods: {
                reset: () => {
                    this.socket.emit("reset");
                },
                setCategory: (category: Category) => {
                    this.socket.emit("setCategory", category.name);
                },
                getCurrentQuestion: function () {
                    let categoryQuestions = this.$get("currentCategory").questions;
                    let questionNo = this.$get("currentQuestionNo");

                    return categoryQuestions[questionNo];
                },
                setAnswer: (answer: Answer) => {
                    this.socket.emit("setAnswer", this._vue.$data.currentQuestionNo, answer.key);
                },
                getFortune: function () {
                    return this.app.getFortune(this.answers);
                },
                displayCategorySelector: function () {
                    return (this.page === PAGE_CATEGORY_SELECT);
                },
                displayQuestionAsker: function () {
                    return (this.page === PAGE_QUESTION_ASKER && !this.displayFortune());
                },
                displayFortune: function () {
                    return (
                        this.currentCategory
                        && Object.keys(this.answers).length === Object.keys(this.currentCategory.questions).length
                    );
                },
            }
        });

        window["vue"] = this._vue;
    }

    reset = () => {
        this._vue.$set("page", PAGE_CATEGORY_SELECT);
        this._vue.$set("currentCategory", null);
        this._vue.$set("currentQuestionNo", null);
        this._vue.$set("answers", {});
    };

    setCategory = (categoryName: string) => {
        this._vue.$set("currentCategory", this.categories[categoryName]);
        this._vue.$set("currentQuestionNo", 1);
        this._vue.$set("page", PAGE_QUESTION_ASKER);
    };

    setAnswer = (questionNo, answerKey) => {
        console.log("setAnswer", questionNo, answerKey);
        Vue.set(this._vue.$data.answers, questionNo, answerKey);
        this._vue.$set("currentQuestionNo", this._vue.$get("currentQuestionNo") + 1);
    };

    // -----------------
    // Getters & Setters
    // -----------------

    /**
     * @returns {Category[]}
     */
    get categories(): CategoryList {
        return this._categories;
    }

    /**
     * Adds a category to the available categories
     *
     * @param category
     */
    public addCategory(category: Category) {
        this._categories[category.name] = category;
    }

    public addFortune(fortune: Fortune) {
        if (undefined === this._fortunes[fortune.answer1]) {
            this._fortunes[fortune.answer1] = [];
        }
        if (undefined === this._fortunes[fortune.answer1][fortune.answer2]) {
            this._fortunes[fortune.answer1][fortune.answer2] = [];
        }
        this._fortunes[fortune.answer1][fortune.answer2][fortune.answer3] = fortune;
    }

    public getFortune(answers: {answer1: string, answer2: string, answer3: string}): Fortune {
        return this._fortunes[answers[1].sequence][answers[2].sequence][answers[3].sequence];
    }

    // get currentCategory(): Category {
    //     return this._currentCategory;
    // }
    //
    // set currentCategory(category: Category) {
    //     this._currentCategory = category;
    // }
    //
    //
    // get currentQuestionNo(): number {
    //     return this._currentQuestionNo;
    // }
    //
    // set currentQuestionNo(value: number) {
    //     this._currentQuestionNo = value;
    // }
}


export interface CategoryList {
    [index: string]: Category;
}