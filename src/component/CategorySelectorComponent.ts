import Vue = require("../vue");
import {Category} from "../model/Category";
import {PAGE_QUESTION_ASKER} from "../App";

const TEMPLATE = "<div class='category-selector'>" +
    "<h2>Select you category</h2>" +
    "<ul><li v-for='category in categories' @click='categorySelected(category)'>" +
    "<div class='category'>{{category.name|capitalize}}</div>" +
    "</li>" +
    "</ul></div>";

export var CategorySelectorComponent = Vue.extend({
    template: TEMPLATE,
    props: ["categories"],
    methods: {
        categorySelected: function (category: Category) {
            this.$root.$set("currentCategory", category);
            this.$root.$set("currentQuestionNo", 1);
            this.$root.page = PAGE_QUESTION_ASKER;
        }
    },
});

Vue.component("category-selector", CategorySelectorComponent);