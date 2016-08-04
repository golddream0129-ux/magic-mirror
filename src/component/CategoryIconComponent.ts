import Vue = require("../vue");

const TEMPLATE = "Icons!";

export var CategoryIconComponent = Vue.extend({
    template: TEMPLATE,
    props: ["category"],
});

Vue.component("category-icon", CategoryIconComponent);