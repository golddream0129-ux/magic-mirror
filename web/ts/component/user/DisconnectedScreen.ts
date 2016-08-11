import ComponentOption = vuejs.ComponentOption;

const TEMPLATE = "<div class='screen-timeout'>" +
    "<div class='content'>" +
    "<p>Sorry, it looks like you've been disconnected.</p>" +
    "<p>Just refresh the page to try again.</p>" +
    "</div>" +
    "</div>";

export const DisconnectedScreen: ComponentOption = {
    template: TEMPLATE,
};