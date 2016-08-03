/// <reference path="../../typings/index.d.ts" />

import {VueFactory} from "../../src/factory/VueFactory";

let config = new (require("../../gulp.config"));
let Vue = require(config.root + "/" + config.vendorDir + "/vue/dist/vue");

describe("VueFactory", function () {

    it("creates a new view", function () {
        let config: vuejs.VueConfig = {
            debug: true,
            delimiters: ["{{", "}}"],
            unsafeDelimiters: ["{{{", "}}}"],
            silent: false,
            async: true,
            devtools: true,
        };

        let factory = new VueFactory();

        let vue = factory.build(config);

        expect(vue instanceof Vue).toBe(true);
    });
});