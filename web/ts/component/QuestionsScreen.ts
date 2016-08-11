import ComponentOption = vuejs.ComponentOption;
import {Answer} from "../model/Answer";

const TEMPLATE = "<div class='screen-questions'>" +
    "<div v-if='getCurrentQuestion()'>" +
    "<header>" +
    "<h2>{{ getCurrentQuestion().wording }}</h2>" +
    "</header>" +
    "<ul>" +
    "<li v-for='answer in getCurrentQuestion().answers' @click='answerSelected(answer)'>" +
    "<div class='answer'>{{ answer.wording }}</div>" +
    "</li>" +
    "</ul>" +
    "</div>" +
    "</div>";

export const QuestionsScreen: ComponentOption = {
    template: TEMPLATE,
    data: function () {
        return this.$root.$data;
    },
    methods: {
        getAnswerCount: function () {
            return Object.keys(this.$root.$get("answers")).length;
        },
        getCurrentQuestionNo: function () {
            return this.getAnswerCount() + 1;
        },
        getCurrentQuestion: function () {
            let questions = this.$root.$get("selectedCategory").questions;

            console.log("questions", questions);
            console.log("currentQuestionNo", this.getCurrentQuestionNo());

            return questions[this.getCurrentQuestionNo()];
        },
        answerSelected: function (answer: Answer) {
            console.log("answer selected - " + answer.sequence);
            this.$root.$set("answers[" + this.getCurrentQuestionNo() + "]", answer.sequence);
        }
    },
};