import ComponentOption = vuejs.ComponentOption;

const TEMPLATE = "<div class='screen-queueing'>" +
    "<div class='content'>You are currently number <span class='queue-position'>{{ queuePosition }}</span> in the queue</div>" +
    "</div>";

export const QueueingScreen: ComponentOption = {
    template: TEMPLATE,
    data: function () {
        return this.$root.$data;
    }
};