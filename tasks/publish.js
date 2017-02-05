var gulp = require('gulp');
var path = require('path');
var fs = require('fs');


// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

/**
 * Push build to s3 repository
 */
gulp.task('publish', function() {

  var publisher = $.awspublish.create(global.credentials, {
    cacheFileName: '.publish.cache'
  });

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=2592000, no-transform, public'
  };

  var options = {
    // force:'skip'
  }

  // create a new publisher
  return gulp.src(path.join(global.paths.dist, '/**/*'))
    .pipe($.awspublish.gzip())
    .pipe(publisher.publish(headers, options))
    .pipe(publisher.sync())
    .pipe($.awspublish.reporter())
});
