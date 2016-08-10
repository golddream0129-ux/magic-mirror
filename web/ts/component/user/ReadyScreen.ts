import ComponentOption = vuejs.ComponentOption;

const TEMPLATE = "<div class='screen-ready'>" +
    "<div class='content'>" +
    "<div class='question'>Are you ready?</div>" +
    "<div class='buttons'>" +
    "<a href='' class='btn btn-primary btn-yes' @click.prevent='yes'>Yes... {{ readyTimer }}</a>" +
    "</div>" +
    "</div>" +
    "</div>";

export const ReadyScreen: ComponentOption = {
    template: TEMPLATE,
    data: function () {
        return this.$root.$data;
    },
    ready: function () {
        this.$el.querySelector(".btn-yes").focus();
    },
    methods: {
        yes: function () {
            this.$root.$set("ready", true);
        },
    }
};