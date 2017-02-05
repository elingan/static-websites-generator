var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var bs = require('browser-sync').get('MyBS');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

/**
 * Serve the Site
 * Watch styles, scripts and images
 */
gulp.task('bs', function() {
  bs.init({
    server: {
      baseDir: [
        global.paths.tmp,
        global.paths.src
      ]
    },
    // reloadDebounce: 1000
  });
});

// gulp.task('browserSync', function() {
//   bs.init({
//     server: {
//       baseDir: global.paths.tmp
//     },
//     files: [path.join(global.paths.tmp, '/**/*')],
//     reloadDebounce: 3000
//   });
// });




/**
 * Serve the Site
 * Watch styles, scripts and images
 */
gulp.task('serve', $.sequence('clean', 'data', ['styles', 'markups', 'posts'], 'watch', 'bs'));


/**
 * Serve the Harp Site in production mode
 */
gulp.task('serve:dist', ['build'], function(done) {
  bs.init({
    server: global.paths.dist
  });
});
