/// <reference path="../../typings/index.d.ts" />

"use strict";

import {VueConfigFactory} from "../../src/factory/VueConfigFactory";

describe("VueConfigFactory", function () {

    let defaultConfig: vuejs.VueConfig = {
        debug: false,
        silent: true,
        async: true,
        delimiters: ["{{", "}}"],
        unsafeDelimiters: ["{{{", "}}}"],
        devtools: false
    };

    it("builds with a default set of values when no options provided", function () {
        expect(VueConfigFactory.build()).toEqual(defaultConfig);
    });

    it("builds supports the 'debug' option", function () {
        let expectedConfig = defaultConfig;

        expectedConfig.debug = true;
        expectedConfig.silent = false;
        expectedConfig.devtools = true;

        expect(VueConfigFactory.build({debug: true})).toEqual(expectedConfig);
    });
});