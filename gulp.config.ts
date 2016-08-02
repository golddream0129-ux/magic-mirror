/**
 * IMPORTANT NOTE
 *
 * When editing the config, make sure you edit the gulp.config.ts file, rather than the generated .js file
 */
class Config {
    public buildDir: string;
    public buildJsDir: string;
    public buildJsFiles: string;
    public spec: string;
    public specAllTypeScript: string[];
    public specTsOutputPath: string;
    public specAllJavaScript: string[];
    public specAllJavaScriptMaps: string[];
    public source: string;
    public srcAllTypeScript: string[];
    public srcTsOutputPath: string;
    public srcAllJavaScript: string[];
    public srcAllJavaScriptMaps: string[];
    public typings: string;
    public appTypeScriptReferences: string;

    constructor() {
        this.buildDir = "./build";
        this.buildJsDir = this.buildDir + "/js";
        this.buildJsFiles = this.buildJsDir = "/**/*.js";
        this.spec = "./spec";
        this.specAllTypeScript = [this.spec + "/**/*.ts"];
        this.specTsOutputPath = this.buildJsDir + "/spec";
        this.specAllJavaScript = [this.specTsOutputPath + "/**/*.js"];
        this.specAllJavaScriptMaps = [this.specTsOutputPath + "/**/*.js.map"];
        this.source = "./src";
        this.srcAllTypeScript = [this.source + "/**/*.ts"];
        this.srcTsOutputPath = this.buildJsDir + "/src";
        this.srcAllJavaScript = [this.srcTsOutputPath + "/**/*.js"];
        this.srcAllJavaScriptMaps = [this.srcTsOutputPath + "/**/*.js.map"];
        this.typings = "./typings";
        this.appTypeScriptReferences = this.typings + "/app.d.ts";
    }
}

declare var module: any;
module.exports = Config;