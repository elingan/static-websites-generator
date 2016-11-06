var gulp = require('gulp');
var conf = require('./conf');
var path = require('path');
var fs = require('fs');
var browserSync = require('browser-sync').create();


// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

/**
 * Serve the Site
 * Watch styles, scripts and images
 */
gulp.task('serve', ['clean', 'copy', 'seo', 'pug', 'stylus', 'posts'], function() {
  browserSync.init({
    server: {
      baseDir: conf.paths.tmp
    }
  });
  gulp.watch(path.join(conf.paths.src, '/**/*.md'), ['posts'])
  gulp.watch(path.join(conf.paths.src, '/**/*.yaml'), ['pug'])
  gulp.watch(path.join(conf.paths.src, '/**/*.pug'), ['pug', 'posts'])
  gulp.watch(path.join(conf.paths.src, '/**/*.styl'), ['stylus'])
  gulp.watch(path.join(conf.paths.src, '/**/*.{js,css,jpg,jpeg,gif,svg,png,ico,eot,ttf,woff,woff2,otf}'), ['copy'])

  gulp.watch(path.join(conf.paths.tmp, '/**/*.html')).on("change", browserSync.reload);

});


/**
 * Serve the Harp Site in production mode
 */
gulp.task('serve:dist', ['build'], function(done) {
  browserSync.init({
    server: conf.paths.dist
  });
});
