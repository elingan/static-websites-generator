var gulp = require('gulp');
var path = require('path');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});


/**
 * Compile the YAML files
 */
gulp.task('data', function() {
  return gulp.src(path.join(global.paths.src, '/**/data.yaml'))
    .pipe($.debug({title: 'data'}))
    .pipe($.yaml())
    .pipe($.mergeJson('data.json')).on('error', global.errorHandler('mergeJson'))
    .pipe(gulp.dest(global.paths.tmp))
});
