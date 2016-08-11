import ComponentOption = vuejs.ComponentOption;

const TEMPLATE = "<div class='screen-timeout'>" +
    "<div class='content'>" +
    "<p>Sorry, but you've taken a little too long.</p>" +
    "<p>Just refresh the page to try again</p>" +
    "</div>" +
    "</div>";

export const TimeoutScreen: ComponentOption = {
    template: TEMPLATE,
};