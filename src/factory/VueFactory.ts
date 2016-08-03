/// <reference path="../../typings/index.d.ts" />

import {VueFactorySpec} from "../../spec/factory/VueFactorySpec";
import {VueConfigFactory, VueConfigFactoryOptions} from "./VueConfigFactory";

let config = new (require("../../gulp.config"));
let Vue = require(config.root + "/" + config.vendorDir + "/vue/dist/vue");

/**
 * @see {VueFactorySpec} for spec
 */
export class VueFactory {

    constructor(private vueConfigFactory: VueConfigFactory) {
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Builds a new Vue object with the given config
     */
    build(configOptions?: VueConfigFactoryOptions): vuejs.Vue {
        return new Vue(this.vueConfigFactory.build(configOptions));
    }
}