'use strict';

var gulp       = require('gulp'),
    Config     = require('./gulp.config'),
    debug      = require('gulp-debug'),
    del        = require('del'),
    inject     = require('gulp-inject'),
    sourcemaps = require('gulp-sourcemaps'),
    tsc        = require('gulp-typescript'),
    tslint     = require('gulp-tslint');

var config    = new Config(),
    tsProject = tsc.createProject('tsconfig.json');

gulp.task('setup', function () {
    gulp.src(['./gulp.config.ts'])
        .pipe(tsc(tsProject))
        .pipe(gulp.dest('.'));
});

gulp.task('ts:clean', function (cb) {
    var typeScriptGenFiles = [
        config.tsOutputPath + '/**/*.js',    // path to all JS files auto gen'd by editor
        config.tsOutputPath + '/**/*.js.map', // path to all sourcemap files auto gen'd by editor
        '!' + config.tsOutputPath + '/lib'
    ];

    // delete the files
    del(typeScriptGenFiles, cb);
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts:lint', function (cb) {
    gulp.src(config.allTypeScript)
        .pipe(tslint())
        .pipe(tslint.report({formatter: 'prose'}));

    cb();
});

/**
 * Generates the app.d.ts references file dynamically from all application *.ts files.
 */
gulp.task('ts:refs:gen', function (cb) {
    var target  = gulp.src(config.appTypeScriptReferences);
    var sources = gulp.src(config.allTypeScript, {read: false});
    //noinspection SpellCheckingInspection
    target
        .pipe(debug)
        .pipe(inject(sources, {
            starttag : '//{',
            endtag   : '//}',
            transform: function (filepath) {
                return '/// <reference path="../..' + filepath + '" />';
            }
        }))
        .pipe(gulp.dest(config.typings));

    cb();
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

gulp.task('ts:watch', function () {
    gulp.watch(config.allTypeScript, ['ts:compile']);
});