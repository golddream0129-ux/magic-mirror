/**
 * IMPORTANT NOTE
 *
 * When editing the config, make sure you edit the gulp.config.ts file, rather than the generated .js file
 */
class Config {
    public root: string;
    public file: string;
    public vendorDir: string;
    public webDir: string;
    public buildDir: string;
    public buildFiles: string;
    public buildJsDir: string;
    public buildJsFiles: string;
    public distDir: string;
    public distTmpDir: string;

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
    public lessDir: string;
    public lessMainFile: string;
    public fontFiles: string;
    public typings: string;
    public appTypeScriptReferences: string;
    public vendorJsFiles: string[];
    public htmlFiles: string[];
    public imgFiles: string[];
    // Server Config
    public serverDir: string;
    public serverAllTypeScript: string[];
    public serverTsOutputPath: string;

    constructor() {
        this.root = __dirname;
        this.file = __filename;
        this.vendorDir = "./node_modules";
        this.webDir = "./web";
        this.buildDir = "./build";
        this.buildFiles = this.buildDir + "/**/*";
        this.buildJsDir = this.buildDir + "/js";
        this.buildJsFiles = this.buildJsDir + "/**/*.js";
        this.distDir = "./dist";
        this.distTmpDir = this.distDir + "/tmp";

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
        this.lessDir = this.webDir + "/less";
        this.lessMainFile = this.lessDir + "/main.less";
        this.fontFiles = this.webDir + "/fonts/*";
        this.typings = "./typings";
        this.appTypeScriptReferences = this.typings + "/app.d.ts";
        this.vendorJsFiles = [this.vendorDir + "/vue/dist/vue.js"];
        this.htmlFiles = [this.webDir + "/**/*.html"];
        this.imgFiles = [this.webDir + "/imgs/**/*"];
        // Server Config
        this.serverDir = "./server";
        this.serverAllTypeScript = [this.serverDir + "/**/*.ts"];
        this.serverTsOutputPath = this.serverDir;
    }
}

declare var module: any;
module.exports = Config;