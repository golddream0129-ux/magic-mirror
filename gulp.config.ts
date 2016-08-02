/**
 * IMPORTANT NOTE
 *
 * When editing the config, make sure you edit the gulp.config.ts file, rather than the generated .js file
 */
class Config {
    public build: string;
    public buildJsFiles: string;
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
        this.build = "./build";
        this.buildJsFiles = this.build + "/js";
        this.spec = "./spec";
        this.specAllTypeScript = [this.spec + "/**/*.ts"];
        this.specTsOutputPath = this.buildJsFiles + "/spec";
        this.specAllJavaScript = [this.specTsOutputPath + "/**/*.js"];
        this.source = "./src";
        this.srcAllTypeScript = [this.source + "/**/*.ts"];
        this.srcTsOutputPath = this.buildJsFiles + "/src";
        this.srcAllJavaScript = [this.srcTsOutputPath + "/**/*.js"];
        this.typings = "./typings";
        this.appTypeScriptReferences = this.typings + "/app.d.ts";
    }
}

declare var module: any;
module.exports = Config;