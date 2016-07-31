'use strict';

var gulp       = require('gulp'),
    Config     = require('./gulp.config'),
    del        = require('del'),
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
gulp.task('ts:lint', function () {
    return gulp.src(config.allTypeScript)
        .pipe(tslint())
        .pipe(tslint.report({formatter: 'prose'}));
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