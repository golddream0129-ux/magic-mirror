'use strict';

var gulp             = require('gulp'),
    Config           = require('./gulp.config'),
    debug            = require('gulp-debug'),
    del              = require('del'),
    inject           = require('gulp-inject'),
    jasmine          = require('gulp-jasmine'),
    notify           = require('gulp-notify'),
    sourcemaps       = require('gulp-sourcemaps'),
    tsc              = require('gulp-typescript'),
    tslint           = require('gulp-tslint');

var config        = new Config(),
    tsSpecProject = tsc.createProject('tsconfig.json'),
    tsSrcProject  = tsc.createProject('tsconfig.json');

gulp.task('setup', function () {
    return gulp.src(['./gulp.config.ts'])
        .pipe(tsc(tsSrcProject))
        .pipe(gulp.dest('.'));
});

gulp.task('ts:clean', function () {
    var typeScriptGenFiles = [
        config.srcTsOutputPath + '/**/*.js',    // path to all JS files auto gen'd by editor
        config.srcTsOutputPath + '/**/*.js.map', // path to all sourcemap files auto gen'd by editor
        '!' + config.srcTsOutputPath + '/lib'
    ];

    // delete the files
    return del(typeScriptGenFiles);
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts:lint', function () {
    return gulp.src(config.srcAllTypeScript)
        .pipe(tslint())
        .pipe(tslint.report({formatter: 'prose'}));
});

/**
 * Generates the app.d.ts references file dynamically from all application *.ts files.
 */
gulp.task('ts:refs:gen', function () {
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

gulp.task('ts:compile', ['ts:clean', 'ts:lint'], function () {
    var srcTsFiles = config.srcAllTypeScript;

    var tscResult = gulp.src(srcTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsSrcProject));

    tscResult.dts.pipe(gulp.dest(config.srcTsOutputPath));

    return tscResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.srcTsOutputPath));
});

gulp.task('spec:ts:compile', function () {
    var specTsFiles = config.specAllTypeScript;

    var tscResult = gulp.src(specTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsSpecProject));

    tscResult.dts.pipe(gulp.dest(config.specTsOutputPath));

    return tscResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.specTsOutputPath));
});

gulp.task('spec', ['ts:compile', 'spec:ts:compile'], function () {
    return gulp.src(config.specAllJavaScript)
        .pipe(debug())
        .pipe(jasmine())
        .on('error', notify.onError({
            title  : 'Jasmine Test Failed',
            message: 'One or more tests failed, see the cli for details.'
        }));
});

gulp.task('ts:watch', ['ts:compile'], function () {
    gulp.watch(config.srcAllTypeScript, ['ts:compile']);
});

gulp.task('spec:watch', ['spec'], function () {
    gulp.watch(config.specAllTypeScript.concat(config.srcAllTypeScript), ['spec']);
});

gulp.task('watch', ['ts:watch']);

gulp.task('default', ['ts:compile']);
