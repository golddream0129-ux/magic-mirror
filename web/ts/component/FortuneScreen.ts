import ComponentOption = vuejs.ComponentOption;

const TEMPLATE = "<div class='screen-fortune'>" +
    "<div class='content'>" +
    "<h2>Answers</h2>" +
    "<div>{{ fortune.fortune }}</div>" +
    "</div>" +
    "</div>";

export const FortuneScreen: ComponentOption = {
    template: TEMPLATE,
    data: function () {
        return {
            fortune: this.$root.getFortune(),
        };
    },
};