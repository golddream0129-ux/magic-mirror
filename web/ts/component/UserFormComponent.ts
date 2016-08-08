"use strict";

import * as Vue from "vue";

const TEMPLATE = "<div class='user-details'>" +
    "<form action=\"#\">" +
    "<label for=\"name\">Tell me thy name?</label>" +
    "<input type=\"text\" id=\"name\" name=\"name\"/>" +
    "<input class=\"btn btn-primary\" type=\"submit\" value=\"Work your magic!\"/>" +
    "</form>" +
    "</div>";

export var UserFormComponent = Vue.extend({
    template: TEMPLATE,
});

Vue.component("user-form", UserFormComponent);