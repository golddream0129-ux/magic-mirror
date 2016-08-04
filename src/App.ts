"use strict";

import {Category} from "./model/Category";

let Vue = require("../node_modules/vue/dist/vue");

export const PAGE_CATEGORY_SELECT = "categorySelect";
export const PAGE_QUESTION_ASKER = "questionAsker";

/**
 * Main App class
 */
export class App {
    public static registerComponents() {
        require("./component/CategorySelector");
        require("./component/QuestionAsker");
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
                answer1: null,
                answer2: null,
                answer3: null,
                answer4: null,
            },
            methods: {
                logData: function () {
                    console.log(this._data);
                    return false;
                },
                getCurrentQuestion: function () {
                    console.log(this.currentCategory.questions[this.currentQuestionNo]);
                    return this.currentCategory.questions[this.currentQuestionNo];
                },
                displayCategorySelector: function () {
                    console.log("checking displayCategorySelector");
                    return (this.page === PAGE_CATEGORY_SELECT);
                },
                displayQuestionAsker: function () {
                    console.log("checking displayQuestionAsker");

                    return (this.page === PAGE_QUESTION_ASKER);

                }
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