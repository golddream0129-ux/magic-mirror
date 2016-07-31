'use strict';

var gulp       = require('gulp'),
    Config     = require('./gulp.config'),
    tsc        = require('gulp-typescript'),
    del        = require('del'),
    sourcemaps = require('gulp-sourcemaps');

var tsProject = tsc.createProject('tsconfig.json'),
    config    = new Config();

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

gulp.task('ts:compile', ['ts:clean'], function () {
    var srcTsFiles = config.allTypeScript;

    var tscResult = gulp.src(srcTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    tscResult.dts.pipe(gulp.dest(config.tsOutputPath));

    return tscResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});