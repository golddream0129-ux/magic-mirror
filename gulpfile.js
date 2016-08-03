'use strict';

var gulp       = require('gulp'),
    Config     = require('./gulp.config'),
    browserify = require('browserify'),
    concat     = require('gulp-concat'),
    debug      = require('gulp-debug'),
    del        = require('del'),
    inject     = require('gulp-inject'),
    jasmine    = require('gulp-jasmine'),
    notify     = require('gulp-notify'),
    source     = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    transform  = require('vinyl-transform'),
    tsc        = require('gulp-typescript'),
    tslint     = require('gulp-tslint');

var config         = new Config(),
    tsSpecProject  = tsc.createProject('tsconfig.json'),
    tsSrcProject   = tsc.createProject('tsconfig.json');

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
 * src:compile
 */
gulp.task('src:compile', ['src:clean', 'src:lint'], function () {
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


//----------------------------------------------------------------------------------------------------------------------
// spec:* tasks
//----------------------------------------------------------------------------------------------------------------------

/**
 * spec:clean
 */
gulp.task('spec:clean', function () {
    var specGeneratedFiles = config.specAllJavaScript.concat(config.specAllJavaScriptMaps);

    // delete the files
    return del(specGeneratedFiles);
});

/**
 * spec:compile
 */
gulp.task('spec:compile', function () {
    var specTsFiles = config.specAllTypeScript;

    var tscResult = gulp.src(specTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsSpecProject));

    tscResult.dts.pipe(gulp.dest(config.specTsOutputPath));

    return tscResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.specTsOutputPath));
});

/**
 * spec
 *
 * Runs tests
 */
gulp.task('spec', ['src:compile', 'spec:src:compile'], function () {
    return gulp.src(config.specAllJavaScript)
        .pipe(debug())
        .pipe(jasmine())
        .on('error', notify.onError({
            title  : 'Jasmine Test Failed',
            message: 'One or more tests failed, see the cli for details.'
        }));
});

/**
 * spec:watch
 *
 * Continuously runs spec tests
 */
gulp.task('spec:watch', ['spec'], function () {
    gulp.watch(config.specAllTypeScript.concat(config.srcAllTypeScript), ['spec']);
});


//----------------------------------------------------------------------------------------------------------------------
// Build tasks
//----------------------------------------------------------------------------------------------------------------------

/**
 * dist:clean
 */
gulp.task('dist:clean', function (cb) {
    del(config.distDir);

    cb();
});

gulp.task('dist:html', function () {
    return gulp.src(config.htmlFiles)
        .pipe(gulp.dest(config.distDir));
});

gulp.task('dist:src', function () {
    var srcTsFiles = config.srcAllTypeScript;

    var tscResult = gulp.src(srcTsFiles, {base: '.'})
        .pipe(sourcemaps.init())
        .pipe(tsc(tsSrcProject));

    tscResult.dts.pipe(gulp.dest(config.srcTsOutputPath));

    return tscResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.distTmpDir));
});

gulp.task('dist:vendor', function () {
    return gulp.src(config.vendorFiles, {base: '.'})
        .pipe(debug())
        .pipe(gulp.dest(config.distTmpDir));
});

/**
 * dist:browserify
 */
gulp.task("dist:browserify", function () {
    return browserify({
        basedir     : '.',
        debug       : true,
        entries     : [config.distTmpDir + '/src/main.js'],
        cache       : {},
        packageCache: {}
    })
        .bundle()
        .pipe(source('js/main.js'))
        .pipe(gulp.dest(config.distDir));
});

gulp.task('dist', ['dist:clean', 'dist:html', 'dist:vendor', 'dist:src', 'dist:browserify']);


gulp.task('dist:watch', ['dist'], function () {
    return gulp.watch(config.srcAllTypeScript, ['dist']);
});