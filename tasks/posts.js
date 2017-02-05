var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
// var bs = require('browser-sync').get('MyBS');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});


/**
 * Compile Posts
 */
gulp.task('posts', function() {
  return gulp.src(path.join(global.paths.src, '/**/*.md'))
    .pipe($.frontMatter())
    .pipe($.markdown())
    .pipe($.layout(function(file) {
      var currentFolder = path.dirname(file.relative);
      var layoutFile = '_' + currentFolder + '.pug';
      var data = JSON.parse(fs.readFileSync(path.join(global.paths.tmp, '/data.json')));
      data.layout = path.join(global.paths.src, '/', currentFolder, layoutFile);
      data.siteUrl = global.siteUrl;
      data.analyticsId = global.analyticsId
      data.environment = global.env;
      return data;
    })).on('error', global.errorHandler('posts:layout'))
    .pipe($.debug({
      title: 'post'
    }))
    .pipe(gulp.dest(path.join(global.paths.tmp, '/')))
    // .pipe(bs.stream());
});
