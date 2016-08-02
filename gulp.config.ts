/**
 * IMPORTANT NOTE
 *
 * When editing the config, make sure you edit the gulp.config.ts file, rather than the generated .js file
 */
class Config {
    public source: string;
    public srcTtsOutputPath: string;
    public allJavaScript: string[];
    public allTypeScript: string[];
    public typings: string;
    public appTypeScriptReferences: string;
    public libraryTypeScriptDefinitions: string[];

    constructor() {
        this.source = "./src";
        this.srcTtsOutputPath = this.source + "/js";
        this.allJavaScript = [this.source + "/js/**/*.js"];
        this.allTypeScript = [this.source + "/ts/**/*.ts"];
        this.typings = "./typings";
        this.appTypeScriptReferences = this.typings + "/app.d.ts";
        this.libraryTypeScriptDefinitions = [this.typings + "/main/**/*.ts"];
    }
}

declare var module: any;
module.exports = Config;