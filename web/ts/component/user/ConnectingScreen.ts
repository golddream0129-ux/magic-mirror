import ComponentOption = vuejs.ComponentOption;

const TEMPLATE = "<div class='screen-connecting'>" +
    "<div class='content'>" +
    "<div class='connecting' v-if='mirrorOnline'>" +
    "<div class='greeting'>Greetings <span class='name'>{{ userName }}</span></div>" +
    "<div class='please-wait'>One moment, please...</div>" +
    "</div>" +
    "<div class='mirror-offline' v-if='!mirrorOnline'>" +
    "It appears that the mirror is offline.  Please wait a while to see if if comes back online, or try again later." +
    "</div>" +
    "</div>" +
    "</div>";

export const ConnectingScreen: ComponentOption = {
    template: TEMPLATE,
    data: function () {
        return this.$root.$data;
    }
};