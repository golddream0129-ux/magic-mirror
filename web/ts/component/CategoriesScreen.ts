import ComponentOption = vuejs.ComponentOption;
import {Category} from "../model/Category";

const TEMPLATE = "<div class='screen-categories'>" +
    "<div class='content'>" +
    "<header>" +
    "<h2>Select your category</h2>" +
    "</header>" +
    "<ul><li v-for='category in categories' @click='categorySelected(category)'>" +
    "<div class='category'>{{category.name|capitalize}}</div>" +
    "</li>" +
    "</ul>" +
    "</div>" +
    "</div>";

export const CategoriesScreen: ComponentOption = {
    template: TEMPLATE,
    data: function(){
        return this.$root.$data;
    },
    methods: {
        categorySelected: function (category: Category) {
            this.$root.$set("selectedCategory", category);
        }
    },
};