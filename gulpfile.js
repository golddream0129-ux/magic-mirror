'use strict';

var gulp      = require('gulp'),
    tsc       = require('gulp-typescript'),
    tsProject = tsc.createProject('tsconfig.json');

gulp.task('setup', function () {
    gulp.src(['./gulp.config.ts'])
        .pipe(tsc(tsProject))
        .pipe(gulp.dest('.'));
});

