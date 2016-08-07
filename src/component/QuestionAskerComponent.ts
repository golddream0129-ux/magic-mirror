import Vue = require("../vue");
import {Answer} from "../model/Answer";

const TEMPLATE = "<div class='question-asker'>" +
    "<header>" +
    "<h2>{{ question.sequence }}. {{ question.wording }}</h2>" +
    "</header>" +
    "<ul>" +
    "<li v-for='answer in question.answers' @click='answerSelected(answer)'>" +
    "<div class='answer'>{{ answer.wording }}</div>" +
    "</li>" +
    "</ul></div>";

export var CategorySelectorComponent = Vue.extend({
    template: TEMPLATE,
    props: ["question"],
    methods: {
        answerSelected: function (answer: Answer) {
            this.$root.setAnswer(answer);
        }
    },
});

Vue.component("question-asker", CategorySelectorComponent);