'use strict';

var gulp   = require('gulp'),
    Config = require('./gulp.config'),
    tsc    = require('gulp-typescript'),
    del    = require('del');

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