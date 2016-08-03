/// <reference path="../../typings/index.d.ts" />

import {VueFactory} from "../../src/factory/VueFactory";
import {VueConfigFactory} from "../../src/factory/VueConfigFactory";

let config = new (require("../../gulp.config"));
let Vue = require(config.root + "/" + config.vendorDir + "/vue/dist/vue");

/**
 * @see {VueFactory}
 */
export class VueFactorySpec {
    static run() {
        describe("VueFactory", function () {

            let vueFactory: VueFactory;

            let vueConfigFactory: VueConfigFactory;

            beforeEach(function () {
                vueConfigFactory = new VueConfigFactory();
                vueFactory = new VueFactory(vueConfigFactory);

                spyOn(vueConfigFactory, "build").and.returnValue(VueConfigFactory.defaultConfig);
            });

            /**
             * @see {VueFactory} build() method
             */
            it("creates a new view with default config", function () {

                let vue = vueFactory.build();

                expect(vue instanceof Vue).toBe(true);
                expect(vueConfigFactory.build).toHaveBeenCalledWith(undefined);
            });

            /**
             * @see {VueFactory} build() method
             */
            it("creates a new view with debug config", function () {

                let vue = vueFactory.build({debug: true});

                expect(vue instanceof Vue).toBe(true);
                expect(vueConfigFactory.build).toHaveBeenCalledWith({debug: true});
            });
        });
    }
}

VueFactorySpec.run();