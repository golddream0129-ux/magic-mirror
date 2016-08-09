import ComponentOption = vuejs.ComponentOption;

const TEMPLATE: string = "<div class='user-details'>" +
    "<form action='#' @submit.prevent='submitForm($event)'>" +
    "<label for='name'>Tell me thy name?</label>" +
    "<input type='text' id='name' class='name' name='name'/>" +
    "<input class='btn btn-primary' type='submit' value='Work your magic!'/>" +
    "</form>" +
    "</div>";

export const EnterNameScreen: ComponentOption = {
    template: TEMPLATE
};