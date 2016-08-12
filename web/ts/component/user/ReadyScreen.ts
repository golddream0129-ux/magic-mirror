import ComponentOption = vuejs.ComponentOption;

const TEMPLATE = "<div class='screen-ready'>" +
    "<div class='content'>" +
    "<p>It's your turn to consult</p>" +
    "<div class='mmm'>Muli's Magical Mirror</div>" +
    "<p>Take your place before the mirror.</p>" +
    "<br/><br/>" +
    "<p>Are you ready?</p>" +
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