var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync').create();
var fs = require('fs');

var conf = require('./conf');


// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

/**
 * Push build to s3 repository
 */
gulp.task('publish', function() {

  var credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
  var publisher = $.awspublish.create(credentials, {
    cacheFileName: '.publish.cache'
  });

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=2592000, no-transform, public'
  };

  // create a new publisher
  return gulp.src(path.join(conf.paths.dist, '/**/*'))
    .pipe($.awspublish.gzip())
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    //.pipe(publisher.cache())
    .pipe($.awspublish.reporter())
});
