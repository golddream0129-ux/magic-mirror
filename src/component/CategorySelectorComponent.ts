import Vue = require("../vue");
import {Category} from "../model/Category";
import {PAGE_QUESTION_ASKER} from "../App";

const TEMPLATE = "<div class='category-selector'>" +
    "<h2>Select your category</h2>" +
    "<ul><li v-for='category in categories' @click='categorySelected(category)'>" +
    "<div class='category'>{{category.name|capitalize}}</div>" +
    "</li>" +
    "</ul></div>";

export var CategorySelectorComponent = Vue.extend({
    template: TEMPLATE,
    props: ["categories"],
    methods: {
        categorySelected: function (category: Category) {
            this.$root.setCategory(category);
        }
    },
});

Vue.component("category-selector", CategorySelectorComponent);