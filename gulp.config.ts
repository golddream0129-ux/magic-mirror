/**
 * IMPORTANT NOTE
 *
 * When editing the config, make sure you edit the gulp.config.ts file, rather than the generated .js file
 */
class Config {
    public spec: string;
    public specAllTypeScript: string[];
    public specTsOutputPath: string;
    public specAllJavaScript: string[];
    public source: string;
    public srcAllTypeScript: string[];
    public srcTsOutputPath: string;
    public srcAllJavaScript: string[];
    public typings: string;
    public appTypeScriptReferences: string;

    constructor() {
        this.spec = "./spec";
        this.specAllTypeScript = [this.spec + "/**/*.ts"];
        this.specTsOutputPath = this.spec;
        this.specAllJavaScript = [this.spec + "/**/*.js"];
        this.source = "./src";
        this.srcAllTypeScript = [this.source + "/**/*.ts"];
        this.srcTsOutputPath = this.source;
        this.srcAllJavaScript = [this.source + "/**/*.js"];
        this.typings = "./typings";
        this.appTypeScriptReferences = this.typings + "/app.d.ts";
    }
}

declare var module: any;
module.exports = Config;