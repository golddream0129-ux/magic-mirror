/**
 * @see {VueConfigFactorySpec} for spec
 */
export class VueConfigFactory {

    private static defaultOptions = {
        debug: false,
        silent: true,
        async: true,
        delimiters: ["{{", "}}"],
        unsafeDelimiters: ["{{{", "}}}"],
        devtools: false
    };

    // noinspection JSMethodCanBeStatic
    /**
     * Builds a VueConfig object based on the options provided
     *
     * @returns vuejs.VueConfig
     */
    build(options?: VueConfigFactoryOptions): vuejs.VueConfig {

        let config: vuejs.VueConfig = VueConfigFactory.defaultOptions;

        options = options || {};

        if (options.debug) {
            config.debug = true;
            config.silent = false;
            config.devtools = true;
        }

        return config;
    }
}

interface VueConfigFactoryOptions {
    debug: boolean;
}