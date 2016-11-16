var gulp = require('gulp');
var path = require('path');
var bs = require('browser-sync').create();
var fs = require('fs');

var conf = require('./conf');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});


/**
 * Compile the Pug files
 */
gulp.task('markups', ['data'], function() {
  return gulp.src([
      path.join(conf.paths.src, '/**/*.pug'),
      path.join('!' + conf.paths.src, '/**/_*.pug')
    ])
    .pipe($.data(function() {
      var data = JSON.parse(fs.readFileSync(path.join(conf.paths.tmp, '/data.json')))
      data.siteUrl = conf.siteUrl;
      data.analyticsId = conf.analyticsId
      data.environment = conf.env;
      return data;
    })).on('error', conf.errorHandler('pug:jsonParse'))
    .pipe($.pug({pretty: true})).on('error', conf.errorHandler('pug:pug'))
    .pipe($.debug({
      title: 'markups'
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(bs.stream());
});
