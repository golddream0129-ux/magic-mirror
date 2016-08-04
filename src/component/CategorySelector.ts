import Vue = require("../vue");
import {Category} from "../model/Category";

export const CategorySelectedEventName = "categorySelected";

const TEMPLATE = "<div class='category-selector'><h2>Select you category</h2>" +
    "<ul><li v-for='category in categories' @click='categorySelected(category)'>{{category.name|capitalize}}</li>" +
    "</ul></div>";

export var CategorySelector = Vue.extend({
    template: TEMPLATE,
    props: ["categories"],
    methods: {
        categorySelected: function (category: Category) {
            let event: CategorySelectedEvent = document.createEvent("UIEvents");
            event.initEvent(CategorySelectedEventName, true, true);
            event.eventName = CategorySelectedEventName;
            event.category = category;
            this.$root.dispatchEvent(event);
        }
    },
});

Vue.component("category-selector", CategorySelector);

export interface CategorySelectedEvent extends UIEvent {
    eventName: string;
    category: Category;
}