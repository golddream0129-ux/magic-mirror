/// <reference path="../../typings/index.d.ts" />

let config = new (require("../../gulp.config"));

let Vue = require(config.root + "/" + config.vendorDir + "/vue/dist/vue");

export class VueFactory {

    /**
     * Builds a new Vue object with the given config
     *
     * @param config
     */
    build(config: vuejs.VueConfig): vuejs.Vue {
        return new Vue(config);
    }
}