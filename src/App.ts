"use strict";

import {Category} from "./model/Category";
import {Answer} from "./model/Answer";

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
        require("./component/Fortune");
    }

    private vue: vuejs.VueStatic;

    private _categories: Category[] = [];

    private _currentCategory: Category;

    private _currentQuestionNo: number;

    constructor(private el: string) {
        App.registerComponents();
    }

    /**
     * Boots the app
     */
    boot(): void {
        this.vue = new Vue({
            el: this.el,
            data: {
                app: this,
                page: PAGE_CATEGORY_SELECT,
                currentCategory: null,
                currentQuestionNo: null,
                answers: {},
            },
            methods: {
                reset: function () {
                    this.page = PAGE_CATEGORY_SELECT;
                    this.currentCategory = null;
                    this.currentQuestionNo = null;
                    this.answers = {};
                },
                getCurrentQuestion: function () {
                    return this.currentCategory.questions[this.currentQuestionNo];
                },
                setAnswer: function (answer: Answer) {
                    Vue.set(this.answers, this.currentQuestionNo, answer);
                },
                nextQuestion: function () {
                    let nextQuestionNo = this.$root.$get("currentQuestionNo") + 1;

                    if (undefined === this.currentCategory.questions[nextQuestionNo]) {
                        this.displayFortune();
                        return;
                    }
                    this.$set("currentQuestionNo", nextQuestionNo);
                },
                getFortune: function () {
                    return this.answers;
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
    }

    // -----------------
    // Getters & Setters
    // -----------------

    /**
     * @returns {Category[]}
     */
    get categories(): Category[] {
        return this._categories;
    }

    /**
     * Adds a category to the available categories
     *
     * @param category
     */
    public addCategory(category: Category) {
        this._categories.push(category);
    }

    get currentCategory(): Category {
        return this._currentCategory;
    }

    set currentCategory(category: Category) {
        this._currentCategory = category;
    }


    get currentQuestionNo(): number {
        return this._currentQuestionNo;
    }

    set currentQuestionNo(value: number) {
        this._currentQuestionNo = value;
    }
}