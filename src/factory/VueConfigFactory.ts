import {VueConfigFactorySpec} from "../../spec/factory/VueConfigFactorySpec";

/**
 * @see {VueConfigFactorySpec} for spec
 */
export class VueConfigFactory {

    private static _defaultConfig: vuejs.VueConfig = {
        debug: false,
        silent: true,
        async: true,
        delimiters: ["{{", "}}"],
        unsafeDelimiters: ["{{{", "}}}"],
        devtools: false
    };

    static get defaultConfig() {
        return VueConfigFactory._defaultConfig;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Builds a VueConfig object based on the options provided
     *
     * @returns vuejs.VueConfig
     */
    build(options?: VueConfigFactoryOptions): vuejs.VueConfig {

        let config: vuejs.VueConfig = VueConfigFactory.defaultConfig;

        options = options || {};

        let debug = options.debug || false;

        if (debug) {
            config.debug = true;
            config.silent = false;
            config.devtools = true;
        }

        return config;
    }
}

export interface VueConfigFactoryOptions {
    debug?: boolean;
}