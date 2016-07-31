'use strict';

var gulp      = require('gulp'),
    Config    = require('./gulp.config'),
    tsc       = require('gulp-typescript'),
    tsProject = tsc.createProject('tsconfig.json');

var config = new Config();

gulp.task('setup', function () {
    gulp.src(['./gulp.config.ts'])
        .pipe(tsc(tsProject))
        .pipe(gulp.dest('.'));
});
