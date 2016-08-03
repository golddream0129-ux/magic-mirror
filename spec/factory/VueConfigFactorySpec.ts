/// <reference path="../../typings/index.d.ts" />

"use strict";

import {VueConfigFactory} from "../../src/factory/VueConfigFactory";

/**
 * @see {VueConfigFactory}
 */
class VueConfigFactorySpec {
    static run() {
        describe("VueConfigFactory", function () {

            let vueConfigFactory: VueConfigFactory;

            beforeAll(function () {
                vueConfigFactory = new VueConfigFactory();
            });

            let defaultConfig: vuejs.VueConfig = {
                debug: false,
                silent: true,
                async: true,
                delimiters: ["{{", "}}"],
                unsafeDelimiters: ["{{{", "}}}"],
                devtools: false
            };

            /**
             * @see {VueConfigFactory} build() method
             */
            it("builds with a default set of values when no options provided", function () {
                expect(vueConfigFactory.build()).toEqual(defaultConfig);
            });

            /**
             * @see {VueConfigFactory} build() method
             */
            it("builds supports the 'debug' option", function () {
                let expectedConfig = defaultConfig;

                expectedConfig.debug = true;
                expectedConfig.silent = false;
                expectedConfig.devtools = true;

                expect(vueConfigFactory.build({debug: true})).toEqual(expectedConfig);
            });
        });
    }
}

VueConfigFactorySpec.run();