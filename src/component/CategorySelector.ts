import Vue = require("../vue");
import {Category} from "../model/Category";

const TEMPLATE = "<div class='category-selector'><h2>Select you category</h2>" +
    "<ul><li v-for='category in categories' @click='categorySelected(category)'>{{category.name|capitalize}}</li>" +
    "</ul></div>";

export var CategorySelector = Vue.extend({
    template: TEMPLATE,
    props: ["categories"],
    methods: {
        categorySelected: function (category: Category) {
            this.$root.$set("app.currentCategory", category);
            this.$root.$set("app.currentQuestion", category.questions[0]);
        }
    },
});

Vue.component("category-selector", CategorySelector);