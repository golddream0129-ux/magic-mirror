import Vue = require("../vue");

const TEMPLATE = "<div class='fortune'>" +
    "<h2>Answers</h2>" +
    "<div v-for='answer in answers'>Question {{ $key }} - {{ answer.wording }}</div>" +
    "</div>";

export var FortuneComponent = Vue.extend({
    template: TEMPLATE,
    props: ["answers"],
    methods: {},
});

Vue.component("fortune", FortuneComponent);