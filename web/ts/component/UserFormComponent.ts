"use strict";

import * as Vue from "vue";

const TEMPLATE = "<div class='user-details'>" +
    "<form action='#' @submit.prevent='submitForm($event)'>" +
    "<label for='name'>Tell me thy name?</label>" +
    "<input type='text' id='name' class='name' name='name'/>" +
    "<input class='btn btn-primary' type='submit' value='Work your magic!'/>" +
    "</form>" +
    "</div>";

export var UserFormComponent = Vue.extend({
    template: TEMPLATE,
    methods: {
        submitForm: function (e) {
            let nameField: HTMLInputElement = e.target.getElementsByClassName("name");

            this.$root.setUserName(nameField.value);
        }
    }
});

Vue.component("user-form", UserFormComponent);