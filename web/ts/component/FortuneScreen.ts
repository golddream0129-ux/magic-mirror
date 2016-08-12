import ComponentOption = vuejs.ComponentOption;

const TEMPLATE = "<div class='screen-fortune'>" +
    "<div class='content'>" +
    "<img class='muli-img' src='imgs/muli1-cropped.jpg' alt='Muli'/>" +
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