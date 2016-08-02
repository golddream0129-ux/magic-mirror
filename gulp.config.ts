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
    public libraryTypeScriptDefinitions: string[];

    constructor() {
        this.spec = "./spec";
        this.specAllTypeScript = [this.spec + "/ts/**/*.ts"];
        this.specTsOutputPath = this.spec + "/js";
        this.specAllJavaScript = [this.spec + "/js/**/*.js"];
        this.source = "./src";
        this.srcAllTypeScript = [this.source + "/ts/**/*.ts"];
        this.srcTsOutputPath = this.source + "/js";
        this.srcAllJavaScript = [this.source + "/js/**/*.js"];
        this.typings = "./typings";
        this.appTypeScriptReferences = this.typings + "/app.d.ts";
        this.libraryTypeScriptDefinitions = [this.typings + "/main/**/*.ts"];
    }
}

declare var module: any;
module.exports = Config;