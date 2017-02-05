var gulp = require('gulp');
var path = require('path');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

/**
 * Delete dist and tmp folder
 */
gulp.task('clean', function() {
  $.del.sync([
    path.join(global.paths.dist, '/'),
    path.join(global.paths.tmp, '/')
  ]);
});
