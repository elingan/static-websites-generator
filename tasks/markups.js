var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
// var bs = require('browser-sync').get('MyBS');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});


/**
 * Compile the Pug files
 */
gulp.task('markups', function() {
  return gulp.src([
      path.join(global.paths.src, '/**/*.pug'),
      path.join('!' + global.paths.src, '/**/_*.pug')
    ])
    .pipe($.data(function() {
      var data = JSON.parse(fs.readFileSync(path.join(global.paths.tmp, '/data.json')))
      data.siteUrl = global.siteUrl;
      data.analyticsId = global.analyticsId
      data.environment = global.env;
      return data;
    })).on('error', global.errorHandler('pug:data'))
    .pipe($.pug({pretty: true})).on('error', global.errorHandler('pug:pug'))
    .pipe($.debug({title: 'markups'}))
    .pipe(gulp.dest(path.join(global.paths.tmp, '/')))
    // .pipe(bs.stream());
});
