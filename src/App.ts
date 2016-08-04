"use strict";

import {Category} from "./model/Category";

let Vue = require("../node_modules/vue/dist/vue");

/**
 * Main App class
 */
export class App {
    public static registerComponents() {
        require("./component/CategorySelector");
    }

    private vue: vuejs.VueStatic;

    private _categories: Category[] = [];

    private currentCategory: Category;

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
                app: this
            },
        });
    }

    // ----------------------------------
    // Display conditional logic methods
    // ----------------------------------

    // noinspection JSUnusedGlobalSymbols
    get displayCategorySelector() {
        return (undefined === this.currentCategory);
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
}