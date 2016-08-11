import ComponentOption = vuejs.ComponentOption;

const TEMPLATE = "<div class='fortune'>" +
    "<h2>Answers</h2>" +
    "<div>{{ fortune.fortune }}</div>" +
    "</div>";

export const FortuneScreen: ComponentOption = {
    template: TEMPLATE,
    data: function () {
        return {
            fortune: this.$root.getFortune(),
        };
    },
};