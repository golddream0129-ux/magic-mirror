import Vue = require("../vue");
import {Answer} from "../model/Answer";

const TEMPLATE = "<div class='question-asker'><h2>Question {{ questionNo }}</h2>" +
    "<div class='question'>Question: {{ question.wording }}</div>" +
    "<ul><li v-for='answer in question.answers' @click='answerSelected(answer)' @click='answerSelected(answer)'>{{ answer.wording }}</li>" +
    "</ul></div>";

export var CategorySelector = Vue.extend({
    template: TEMPLATE,
    props: ["question"],
    methods: {
        answerSelected: function (answer: Answer) {
            this.$root.$set("app.currentAnswer", answer);
            this.$root.$set("app.currentQuestion", 0);
        }
    },
});

Vue.component("question-asker", CategorySelector);