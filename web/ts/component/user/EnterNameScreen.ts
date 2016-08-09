import ComponentOption = vuejs.ComponentOption;

const TEMPLATE: string = "<div class='screen-enter-name' data-screen='enter-name'>" +
    "<div class='content'>" +
    "<form action='#' @submit.prevent='submitForm()'>" +
    "<label for='name'>Tell me thy name?</label>" +
    "<input type='text' id='name' class='name' name='name' v-model='userName'/>" +
    "<input class='btn btn-primary' type='submit' value='Work your magic!'/>" +
    "</form>" +
    "</div>" +
    "</div>";

export var EnterNameScreen: ComponentOption = {
    template: TEMPLATE,
    data: function () {
        return {
            userName: "",
        };
    },
    methods: {
        submitForm: function () {
            this.$root.$set("userName", this.userName);
        }
    }
};