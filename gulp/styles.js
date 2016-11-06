var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync').create();

var conf = require('./conf');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

/**
 * Compile the Stylus files
 */
gulp.task('stylus', function() {
  return gulp.src(path.join(conf.paths.src, '/**/*.styl'))
    .pipe($.debug({
      title: 'stylus'
    }))
    .pipe($.stylus())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(browserSync.stream());
});
