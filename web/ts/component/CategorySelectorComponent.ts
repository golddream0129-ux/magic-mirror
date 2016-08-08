"use strict";

import * as Vue from "vue";
import {Category} from "../model/Category";

const TEMPLATE = "<div class='category-selector'>" +
    "<header>" +
    "<h2>Select your category</h2>" +
    "</header>" +
    "<ul><li v-for='category in categories' @click='categorySelected(category)'>" +
    "<div class='category'>{{category.name|capitalize}}</div>" +
    "</li>" +
    "</ul></div>";

export var CategorySelectorComponent = Vue.extend({
    template: TEMPLATE,
    props: ["categories"],
    methods: {
        categorySelected: function (category: Category) {
            this.$root.setCategoryHandler(category);
        }
    },
});

Vue.component("category-selector", CategorySelectorComponent);