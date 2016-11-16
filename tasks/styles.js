var gulp = require('gulp');
var path = require('path');
var bs = require('browser-sync').create();

var conf = require('./conf');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

/**
 * Compile the Stylus files
 */
gulp.task('styles', function() {
  return gulp.src(path.join(conf.paths.src, '/**/*.styl'))
    .pipe($.stylus())
    .pipe($.debug({title: 'styles'}))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(bs.stream());
});
