'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');

const paths = {
  icons: {
    src: [
      'node_modules/@fortawesome/fontawesome-free/svgs/solid/power-off.svg',
      'node_modules/@fortawesome/fontawesome-free/svgs/solid/lightbulb.svg',
    ],
    dest: 'static/icons/'
  }
};

const svgo = require('gulp-svgo');
const svgstore = require('gulp-svgstore');
gulp.task('icons', () => {
  return gulp.src(paths.icons.src)
    .pipe(svgo())
    .pipe(svgstore())
    .pipe(rename('bundle.min.svg'))
    .pipe(gulp.dest(paths.icons.dest));
});


gulp.task('copy', gulp.parallel('icons'));

const del = require('del');
gulp.task('clean', () => del(['build']));

gulp.task('build', gulp.series('clean', 'copy'));
