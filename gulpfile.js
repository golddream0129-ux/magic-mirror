'use strict';

var gulp       = require('gulp'),
    Config     = require('./gulp.config'),
    browserify = require('browserify'),
    concat     = require('gulp-concat'),
    cssmin     = require('gulp-cssmin'),
    debug      = require('gulp-debug'),
    del        = require('del'),
    inject     = require('gulp-inject'),
    jasmine    = require('gulp-jasmine'),
    less       = require('gulp-less'),
    notify     = require('gulp-notify'),
    rename     = require('gulp-rename'),
    source     = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    transform  = require('vinyl-transform'),
    tsc        = require('gulp-typescript'),
    tslint     = require('gulp-tslint');

var config          = new Config(),
    tsSrcProject    = tsc.createProject('tsconfig.json'),
    tsServerProject = tsc.createProject('tsconfig.json');

gulp.task('setup', function () {
    return gulp.src(['./gulp.config.ts'])
        .pipe(tsc(tsSrcProject))
        .pipe(gulp.dest('.'));
});


//----------------------------------------------------------------------------------------------------------------------
// build:web tasks
//----------------------------------------------------------------------------------------------------------------------

/**
 * Clean build web directory ready for build
 *
 * Task: build:web:clean
 */
gulp.task("build:web:clean", function () {
    return del.sync(config.buildDir + "/web/**/*");
});

/**
 * Task: build:web:html
 */
gulp.task("build:web:html", function () {
    return gulp.src(config.webDir + "/**/*.html")
        .pipe(gulp.dest(config.buildDir + "/web"));
});

/**
 * Task: build:web:images
 */
gulp.task("build:web:images", function () {
    return gulp.src(config.webDir + "/imgs/**/*")
        .pipe(gulp.dest(config.buildDir + "/web/imgs"));
});

/**
 * Task: build:web:css
 */
gulp.task("build:web:css", function () {
    return gulp.src(config.webDir + "/less/main.less")
        .pipe(less().on('error', function (err) {
            console.log(err);
        }))
        .pipe(cssmin().on('error', function (err) {
            console.log(err);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.buildDir + "/web/css"));
});


gulp.task("build:web:fonts", function () {
    return gulp.src(config.webDir + "/fonts/**/*")
        .pipe(gulp.dest(config.buildDir + "/web/fonts"));
});

/**
 * Task: build:web:lint-js
 */
gulp.task("build:web:lint-js", function () {
    return gulp.src(config.webDir + "/ts/**/*.ts")
        .pipe(tslint())
        .pipe(tslint.report({formatter: 'prose'}));
});

/**
 * Task: build:web:js
 */
gulp.task("build:web:js", ["build:web:lint-js"], function () {
    var tscResult = gulp.src(config.webDir + "/ts/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsc(tsSrcProject));

    return tscResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.buildDir + "/web/js"));
});

/**
 * Task: build:web:ts-refs
 */
gulp.task("build:web:ts-refs", function () {
    //noinspection SpellCheckingInspection,JSUnusedGlobalSymbols
    return gulp.src(config.typingsDir + "/app.d.ts")
        .pipe(inject(gulp.src(config.webDir + "/ts/**/*.ts", {read: false}), {
            starttag : '// {',
            endtag   : '// }',
            transform: function (filepath) {
                return '/// <reference path="..' + filepath + '" />';
            }
        }))
        .pipe(gulp.dest(config.typingsDir));
});

/**
 * Task: build:web
 */
gulp.task("build:web", ["build:web:clean", "build:web:html", "build:web:images", "build:web:css", "build:web:lint-js", "build:web:js", "build:web:ts-refs"])


//----------------------------------------------------------------------------------------------------------------------
// build:server tasks
//----------------------------------------------------------------------------------------------------------------------

/**
 * Task: build:server:clean
 */
gulp.task("build:server:clean", function () {
    return del.sync(config.buildDir + "/server/**/*");
});

/**
 * Task: build:server:js
 */
gulp.task("build:server:js", function () {
    var tscResult = gulp.src(config.serverDir + "/**/*.ts")
        .pipe(tsc(tsServerProject));

    return tscResult.js
        .pipe(gulp.dest(config.buildDir + "/server"));
});

/**
 * Task: build:server
 */
gulp.task("build:server", ["build:server:clean", "build:server:js"]);


//----------------------------------------------------------------------------------------------------------------------
// build tasks
//----------------------------------------------------------------------------------------------------------------------

/**
 * Task: build:clean
 */
gulp.task("build:clean", ["build:web:clean", "build:server:clean"]);

/**
 * Task: build
 */
gulp.task("build", ["build:web", "build:server"]);

/**
 * Task: build:watch
 */
gulp.task("build:watch", ["build:web", "build:server"], function () {
    gulp.watch([config.webDir + "/**/*", config.serverDir + "/**/*"], ["build:web", "build:server"]);
});


//----------------------------------------------------------------------------------------------------------------------
// Build tasks
//----------------------------------------------------------------------------------------------------------------------

/**
 * Task: dist:web:clean
 */
gulp.task('dist:web:clean', function () {
    del.sync(config.distDir + "/web/**/*");
});

/**
 * Task: dist:web:html
 */
gulp.task("dist:web:html", ["build:web:html"], function () {
    return gulp.src(config.buildDir + "/web/**/*.html")
        .pipe(gulp.dest(config.distDir + "/web"));
});

/**
 * Task: dist:web:images
 */
gulp.task("dist:web:images", ["build:web:images"], function () {
    return gulp.src(config.buildDir + "/web/imgs/**.*")
        .pipe(gulp.dest(config.distDir + "/web/imgs"));
});

/**
 * Task: dist:web:css
 */
gulp.task("dist:web:css", ["build:web:css"], function () {
    return gulp.src(config.buildDir + "/web/css/**.*")
        .pipe(gulp.dest(config.distDir + "/web/css"));
});

/**
 * Task: dist:web:fonts
 */
gulp.task("dist:web:fonts", ["build:web:fonts"], function () {
    return gulp.src(config.buildDir + "/web/fonts/**.*")
        .pipe(gulp.dest(config.distDir + "/web/fonts"));
});

/**
 * Task: dist:web:js
 */
gulp.task("dist:web:js", ["build:web:js"], function () {
    return browserify({
        basedir     : ".",
        debug       : true,
        entries     : [config.buildDir + "/web/js/main.js"],
        cache       : {},
        packageCache: {}
    })
        .bundle()
        .pipe(source("web/js/main.js"))
        .pipe(gulp.dest(config.distDir));
});

/**
 * Task: dist:web
 */
gulp.task("dist:web", ["dist:web:clean", "dist:web:html", "dist:web:images", "dist:web:css", "dist:web:fonts", "dist:web:js"]);

/**
 * Task: dist:server:clean
 */
gulp.task("dist:server:clean", function () {
    return del.sync(config.distDir + "/server/**/*");
});

/**
 * Task: dist:server:files
 */
gulp.task("dist:server:files", ["build:server"], function () {
    return gulp.src(config.buildDir + "/server/**/*")
        .pipe(gulp.dest(config.distDir + "/server"));
});

/**
 * Task: dist:server
 */
gulp.task("dist:server", ["dist:server:clean", "dist:server:files"]);

/**
 * Task dist:clean
 */
gulp.task("dist:clean", ["dist:web:clean", "dist:server:clean"]);

/**
 * Task: dist
 */
gulp.task("dist", ["dist:web", "dist:server"]);


gulp.task("dist:watch", ["dist"], function () {
    return gulp.watch([config.webDir + "/**/*", config.serverDir + "/**/*"], ['dist']);
});