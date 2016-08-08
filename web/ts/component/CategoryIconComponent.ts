"use strict";

import * as Vue from "vue";

const TEMPLATE = "<div class='category-icon'>" +
    "<img src='imgs/icon-love.png' v-if='shouldShowCategory(\"love\")'/>" +
    "<img src='imgs/icon-prosperity.png' v-if='shouldShowCategory(\"prosperity\")'/>" +
    "<img src='imgs/icon-body-mind.png' v-if='shouldShowCategory(\"body & mind\")'/>" +
    "<img src='imgs/icon-mystery.png' v-if='shouldShowCategory(\"mystery\")'/>" +
    "</div>";

export var CategoryIconComponent = Vue.extend({
    template: TEMPLATE,
    props: ["category"],
    methods: {
        shouldShowCategory: function (category) {
            return (this.category && category === this.category.name);
        }
    }
});

Vue.component("category-icon", CategoryIconComponent);