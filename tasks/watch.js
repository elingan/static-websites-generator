var gulp = require('gulp');
var path = require('path');
var bs = require('browser-sync').get('MyBS');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});


gulp.task('reload', function() {
  bs.reload();
});


/**
 * Serve the Site
 * Watch styles, scripts and images
 */
gulp.task('watch', function() {

  gulp.watch([
    path.join(global.paths.src, '/**/*.yaml'),
    path.join(global.paths.src, '/**/*.pug'),
    path.join(global.paths.src, '/**/*.md')
  ], function(event) {
    var sequence = $.sequence('data', 'markups', 'posts')
    sequence(function(err) {
      if (err) console.log(err);
      bs.reload();
    })
  })
  // gulp.watch(path.join(global.paths.src, '/**/*.pug'), ['markups', 'posts'])
  // gulp.watch(path.join(global.paths.src, '/**/*.md'), ['posts'])
  gulp.watch(path.join(global.paths.src, '**/*.styl'), ['styles'])
  gulp.watch(path.join(global.paths.src, '**/*.js')).on('change', bs.reload);

  //gulp.watch(path.join(global.paths.src, '/**/*.{js,css,jpg,jpeg,gif,svg,png,ico,eot,ttf,woff,woff2,otf}'), ['copy'])

  // gulp.watch(path.join(global.paths.tmp, '*.html')).on('change', bs.reload);

});
