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

var config       = new Config(),
    tsSrcProject = tsc.createProject('tsconfig.json');

gulp.task('setup', function () {
    return gulp.src(['./gulp.config.ts'])
        .pipe(tsc(tsSrcProject))
        .pipe(gulp.dest('.'));
});


//----------------------------------------------------------------------------------------------------------------------
// src:* tasks
//----------------------------------------------------------------------------------------------------------------------

/**
 * src:clean
 */
gulp.task('src:clean', function () {
    var srcGeneratedFiels = config.srcAllJavaScript.concat(config.srcAllJavaScriptMaps);

    // delete the files
    return del(srcGeneratedFiels);
});

/**
 * src:lint
 */
gulp.task('src:lint', function () {
    return gulp.src(config.srcAllTypeScript)
        .pipe(tslint())
        .pipe(tslint.report({formatter: 'prose'}));
});

/**
 * Copy the required vendor files to the build directory
 */
gulp.task('src:vendor', ['src:clean'], function () {
    return gulp.src(config.vendorJsFiles, {base: '.'})
        .pipe(gulp.dest(config.buildJsDir));
});

/**
 * src:compile
 */
gulp.task('src:compile', ['src:clean'], function () {
    var srcTsFiles = config.srcAllTypeScript;

    var tscResult = gulp.src(srcTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsSrcProject));

    tscResult.dts.pipe(gulp.dest(config.srcTsOutputPath));

    return tscResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.srcTsOutputPath));
});

/**
 * src:refs:gen
 */
gulp.task('src:refs:gen', function () {
    var target  = gulp.src(config.appTypeScriptReferences);
    var sources = gulp.src(config.srcAllTypeScript, {read: false});

    //noinspection SpellCheckingInspection,JSUnusedGlobalSymbols
    return target
        .pipe(inject(sources, {
            starttag : '// {',
            endtag   : '// }',
            transform: function (filepath) {
                return '/// <reference path="..' + filepath + '" />';
            }
        }))
        .pipe(gulp.dest(config.typings));
});

gulp.task('src', ['src:lint', 'src:refs:gen', 'src:vendor', 'src:compile']);


//----------------------------------------------------------------------------------------------------------------------
// Build tasks
//----------------------------------------------------------------------------------------------------------------------

/**
 * dist:clean
 */
gulp.task('dist:clean', function () {
    del.sync(config.distDir + "/**/*");
});

gulp.task('dist:server', ['dist:clean'], function () {
    var serverTsFiles = config.serverAllTypeScript;

    var tscResult = gulp.src(serverTsFiles)
        .pipe(tsc(tsSrcProject));

    // return tscResult.dts.pipe(gulp.dest(config.serverTsOutputPath));

    return tscResult.js
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.serverTsOutputPath));
});

gulp.task('dist:html', ['dist:clean'], function () {
    return gulp.src(config.htmlFiles)
        .pipe(gulp.dest(config.distDir));
});

gulp.task('dist:images', ['dist:clean'], function () {
    return gulp.src(config.imgFiles, {base: "web"})
        .pipe(gulp.dest(config.distDir));
});

gulp.task('dist:styles', ['dist:clean'], function () {
    console.log(config.lessMainFile);
    return gulp.src(config.lessMainFile)
        .pipe(debug())
        .pipe(less().on('error', function (err) {
            console.log(err);
        }))
        .pipe(cssmin().on('error', function (err) {
            console.log(err);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.distDir + "/css"));
});

gulp.task('dist:fonts', ['dist:clean'], function () {
    console.log(config.fontFiles);
    return gulp.src(config.fontFiles)
        .pipe(gulp.dest(config.distDir + '/fonts'));
});

gulp.task('dist:src', ['dist:clean', 'src']);

/**
 * dist:browserify
 */
gulp.task("dist:browserify", ['dist:src'], function () {
    return browserify({
        basedir     : '.',
        debug       : true,
        entries     : [config.buildJsDir + '/src/main.js'],
        cache       : {},
        packageCache: {}
    })
        .bundle()
        .pipe(source('js/main.js'))
        .pipe(gulp.dest(config.distDir));
});

gulp.task('dist', ['dist:server', 'dist:html', 'dist:images', 'dist:styles', 'dist:fonts', 'dist:src', 'dist:browserify']);


gulp.task('dist:watch', ['dist'], function () {
    return gulp.watch(config.srcAllTypeScript
        .concat(config.webDir + "/**/*")
        .concat(config.serverAllTypeScript), ['dist']);
});