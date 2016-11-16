var gulp = require('gulp');
var conf = require('./conf');
var path = require('path');
var fs = require('fs');
var bs = require('browser-sync').create();


// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});


/**
 * Serve the Site
 * Watch styles, scripts and images
 */
gulp.task('browserSync', function() {

  bs.init({
    server: {
      baseDir: conf.paths.tmp
    },
    files: [path.join(conf.paths.tmp, '/**/*')],
    reloadDebounce: 2000
    //reloadThrottle: 2000
  });

  // gulp.watch(path.join(conf.paths.tmp, '/**/index.html')).on("change", bs.reload);
  // gulp.watch(path.join(conf.paths.tmp, '/**/*.html'), function(event) {
  //   console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  // });

});


/**
 * Serve the Site
 * Watch styles, scripts and images
 */
gulp.task('watch', function() {

  gulp.watch(path.join(conf.paths.src, '/**/*.yaml'), ['markups', 'posts'])
  gulp.watch(path.join(conf.paths.src, '/**/*.pug'), ['markups'])
  gulp.watch(path.join(conf.paths.src, '/**/*.md'), ['posts'])
  gulp.watch(path.join(conf.paths.src, '/**/*.styl'), ['styles'])
  gulp.watch(path.join(conf.paths.src, '/**/*.{js,css,jpg,jpeg,gif,svg,png,ico,eot,ttf,woff,woff2,otf}'), ['copy'])

});



/**
 * Serve the Site
 * Watch styles, scripts and images
 */
gulp.task('serve', $.sequence(['clean', 'copy', 'seo', 'data'], ['styles', 'markups', 'posts'], 'watch', 'browserSync'));


/**
 * Serve the Harp Site in production mode
 */
gulp.task('serve:dist', ['build'], function(done) {
  bs.init({
    server: conf.paths.dist
  });
});
