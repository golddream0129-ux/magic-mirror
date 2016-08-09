import ComponentOption = vuejs.ComponentOption;

const TEMPLATE = "<div class='screen-connecting'>" +
    "<div class='content'>" +
    "<div class='greeting'>Greetings <span class='name'>{{ userName }}</span></div>" +
    "<div class='please-wait'>One moment, please...</div>" +
    "</div>" +
    "</div>";

export const ConnectingScreen: ComponentOption = {
    template: TEMPLATE,
    data: function () {
        return {userName: this.$root.$get("userName")};
    }
};