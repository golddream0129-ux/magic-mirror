/**
 * IMPORTANT NOTE
 *
 * When editing the config, make sure you edit the gulp.config.ts file, rather than the generated .js file
 */
class Config {
    public webDir: string;
    public buildDir: string;
    public distDir: string;
    public typingsDir: string;
    // Server Config
    public serverDir: string;

    constructor() {
        this.webDir = "./web";
        this.buildDir = "./build";
        this.distDir = "./dist";
        this.typingsDir = "./typings";
        // Server Config
        this.serverDir = "./server";
    }
}

declare var module: any;
module.exports = Config;