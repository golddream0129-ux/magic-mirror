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
        getCurrentQuestion: function () {
            return this.$root.getCurrentQuestion();
        },
        answerSelected: function (answer: Answer) {
            console.log("answer selected - " + answer.sequence);
            this.$root.$set("answers[" + this.$root.getCurrentQuestionNo() + "]", answer.sequence);
        }
    },
};