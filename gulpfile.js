'use strict';

var gulp       = require('gulp'),
    Config     = require('./gulp.config'),
    debug      = require('gulp-debug'),
    del        = require('del'),
    inject     = require('gulp-inject'),
    jasmine    = require('gulp-jasmine'),
    sourcemaps = require('gulp-sourcemaps'),
    tsc        = require('gulp-typescript'),
    tslint     = require('gulp-tslint');

var config    = new Config(),
    tsProject = tsc.createProject('tsconfig.json');

gulp.task('setup', function () {
    return gulp.src(['./gulp.config.ts'])
        .pipe(tsc(tsProject))
        .pipe(gulp.dest('.'));
});

gulp.task('ts:clean', function () {
    var typeScriptGenFiles = [
        config.tsOutputPath + '/**/*.js',    // path to all JS files auto gen'd by editor
        config.tsOutputPath + '/**/*.js.map', // path to all sourcemap files auto gen'd by editor
        '!' + config.tsOutputPath + '/lib'
    ];

    // delete the files
    return del(typeScriptGenFiles);
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts:lint', function () {
    return gulp.src(config.allTypeScript)
        .pipe(tslint())
        .pipe(tslint.report({formatter: 'prose'}));
});

/**
 * Generates the app.d.ts references file dynamically from all application *.ts files.
 */
gulp.task('ts:refs:gen', function () {
    var target  = gulp.src(config.appTypeScriptReferences);
    var sources = gulp.src(config.allTypeScript, {read: false});

    //noinspection SpellCheckingInspection,JSUnusedGlobalSymbols
    return target
        .pipe(inject(sources, {
            starttag : '//{',
            endtag   : '//}',
            transform: function (filepath) {
                return '/// <reference path="../..' + filepath + '" />';
            }
        }))
        .pipe(gulp.dest(config.typings));
});

gulp.task('ts:compile', ['ts:clean', 'ts:lint'], function () {
    var srcTsFiles = config.allTypeScript;

    var tscResult = gulp.src(srcTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    tscResult.dts.pipe(gulp.dest(config.tsOutputPath));

    return tscResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});

gulp.task('spec', ['ts:compile'], function () {
    console.log(config.allSpecs);
    return gulp.src(config.allSpecs)
        .pipe(debug())
        .pipe(jasmine());
});

gulp.task('ts:watch', ['ts:compile'], function () {
    gulp.watch(config.allTypeScript, ['ts:compile']);
});

gulp.task('watch', ['ts:watch']);

gulp.task('default', ['ts:compile']);
