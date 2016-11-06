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
 * Compile Posts
 */
gulp.task('posts', ['yaml'], function() {
  return gulp.src('./src/**/*.md')
    .pipe($.frontMatter())
    .pipe($.markdown())
    .pipe($.layout(function(file) {
      var currentFolder = path.dirname(file.relative);
      var layoutFile = '_' + currentFolder + '.pug';
      var data = JSON.parse(fs.readFileSync(path.join(conf.paths.tmp, '/data.json')));
      data.layout = path.join(conf.paths.src, '/', currentFolder, layoutFile);
      data.siteUrl = conf.siteUrl;
      data.analyticsId = conf.analyticsId
      data.environment = conf.env;
      return data;
    })).on('error', conf.errorHandler('posts:layout'))
    .pipe($.debug({
      title: 'post'
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(browserSync.stream());
});
