var gulp = require('gulp');
var path = require('path');
var conf = require('./conf');


// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});


/**
 * Compile the YAML files
 */
gulp.task('data', function() {
  return gulp.src(path.join(conf.paths.src, '/**/data.yaml'))
    .pipe($.debug({
      title: 'data'
    }))
    .pipe($.yaml())
    .pipe($.mergeJson('data.json')).on('error', conf.errorHandler('mergeJson'))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
});
