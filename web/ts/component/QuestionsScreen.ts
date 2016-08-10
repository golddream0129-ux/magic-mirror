import ComponentOption = vuejs.ComponentOption;
import {Answer} from "../model/Answer";
import {Category, CategoryQuestions} from "../model/Category";

const TEMPLATE = "<div class='screen-questions'>" +
    "<header>" +
    "<h2>{{ question.wording }}</h2>" +
    "</header>" +
    "<ul>" +
    "<li v-for='answer in question.answers' @click='answerSelected(answer)'>" +
    "<div class='answer'>{{ answer.wording }}</div>" +
    "</li>" +
    "</ul></div>";

export const QuestionsScreen: ComponentOption = {
    template: TEMPLATE,
    data: function () {
        let category: Category = this.$root.$get("selectedCategory");
        let questions: CategoryQuestions = category.questions;
        console.log("questions", questions);
        let questionNo: number = this.$root.$get("currentQuestionNo");

        return {
            question: questions[questionNo],
        };
    },
    methods: {
        answerSelected: function (answer: Answer) {
            let questionNo: number = this.$root.$get("currentQuestionNo");
            this.$root.$set("answers[" + questionNo + "]", answer);
        }
    },
};