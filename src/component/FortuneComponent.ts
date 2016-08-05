import Vue = require("../vue");

const TEMPLATE = "<div class='fortune'>" +
    "<h2>Answers</h2>" +
    "<div>{{ fortune.fortune }}</div>" +
    "</div>";

export var FortuneComponent = Vue.extend({
    template: TEMPLATE,
    props: ["fortune"],
    methods: {},
});

Vue.component("fortune", FortuneComponent);