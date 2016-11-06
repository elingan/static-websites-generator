var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync').create();

var conf = require('./conf');


// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});


/**
 * Compile the YAML files
 */
gulp.task('yaml', function() {
  return gulp.src(path.join(conf.paths.src, '/**/data.yaml'))
    .pipe($.debug({
      title: 'yaml'
    }))
    .pipe($.yaml())
    .pipe($.mergeJson('data.json')).on('error', conf.errorHandler('mergeJson'))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(browserSync.stream());
});
