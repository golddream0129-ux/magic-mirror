"use strict";

import {Category} from "./model/Category";
// import {CategorySelector, CategorySelectedEventName} from "./component/CategorySelector";

let Vue = require("../node_modules/vue/dist/vue");

/**
 * Main App class
 */
export class App {

    private vue: vuejs.VueStatic;

    private _categories: Category[] = [];

    constructor(private el: string) {
    }

    /**
     * Boots the app
     */
    boot(): void {

        let x = Vue.extend({
            template: "<div>XXX</div>"
        });
        Vue.component("x", x);


        this.vue = new Vue({
            el: this.el,
            data: {
                app: this,
                page: "categorySelector",
            },
            components: {
                x: {},
                categorySelector: {
                    activate: function (done) {
                        console.log("activate");
                        let self = this;
                        // loadDataAsync(function (data) {
                        //     self.someData = data;
                        //     done();
                        // });
                    }
                }
            },
            methods: {
                categorySelected: function (category) {
                    this.selectedCategory = category;
                    console.log(this.selectedCategory);
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
}