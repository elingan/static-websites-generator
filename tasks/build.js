var gulp = require('gulp');
var path = require('path');

const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegoptim = require('imagemin-jpegoptim');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

/**
 * Copy css, js, fonts and image files to .tmp
 */
gulp.task('copy', function() {
  return gulp.src([
      path.join(global.paths.src, '/**/*.{js,css,mp4,webm,ogv}'),
      path.join('!' + global.paths.src, 'config')
    ])
    .pipe($.debug({
      title: 'copy'
    }))
    .pipe(gulp.dest(path.join(global.paths.tmp, '/')))
});

/**
 * Copy css, js, fonts and image files to .tmp
 */
gulp.task('copy:www', function() {
  return gulp.src(path.join(global.paths.src, '/config/www/*'))
    .pipe($.debug({title: 'copy:www'}))
    .pipe(gulp.dest(path.join(global.paths.dist, '/')))
});




/**
 * Imagemin for all images
 */
gulp.task('images', function() {
  return gulp.src(path.join(global.paths.src, 'assets/images/**/*.{jpg,jpeg,gif,svg,png,ico}'))
    .pipe($.imagemin(
      // [
      //   imageminGifsicle(),
      //   imageminJpegoptim({
      //     progressive: true,
      //     max: 50
      //   }),
      //   imageminOptipng(),
      //   imageminSvgo()
      // ],
      {
        verbose: true,
      })).on('error', global.errorHandler('imagemin'))
    .pipe(gulp.dest(path.join(global.paths.dist, 'assets/images')));
});

/**
 * Copy all fonts
 */
gulp.task('fonts', function() {
  return gulp.src(path.join(global.paths.src, '/assets/fonts/*.{svg,eot,ttf,woff,woff2,otf}'))
    .pipe($.debug({
      title: 'fonts'
    }))
    .pipe(gulp.dest(path.join(global.paths.dist, '/assets/fonts')));
});


/**
 * Process .tmp files
 */
gulp.task('dist', function() {
  // genera los assets basado en el index principal
  var jsFilter = $.filter('**/*.js', {
    restore: true
  });
  var cssFilter = $.filter('**/*.css', {
    restore: true
  });

  var htmlIndexFilter = $.filter('index.html', {
    restore: true
  });

  var htmlFilter = $.filter(['**/*.html', '!index.html'], {
    restore: true
  });

  gulp.src(path.join(global.paths.tmp, '/**/*.html'))
    .pipe($.jsbeautifier({
      indent_size: 2
    }))
    // toma como referencia index.html para procesar css y js
    .pipe(htmlIndexFilter)
    .pipe($.useref()).on('error', global.errorHandler('useref-index'))
    .pipe($.debug({title: 'dist'}))
    .pipe(jsFilter)
    .pipe($.debug({title: 'dist:js'}))
    .pipe($.jsmin()).on('error', global.errorHandler('jsmin'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.cssmin()).on('error', global.errorHandler('cssmin'))
    .pipe(cssFilter.restore)
    .pipe(htmlIndexFilter.restore)
    // restaura y procesa todos los html
    .pipe(htmlFilter)
    .pipe($.useref({
      noAssets: true
    })).on('error', global.errorHandler('useref-html'))
    .pipe($.htmlmin()).on('error', global.errorHandler('htmlmin'))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(global.paths.dist, '/')))
});



/**
 * Generate a sitemap.xml file
 */
gulp.task('sitemap', function() {
  gulp.src(path.join(global.paths.dist, '/**/*.html'), {
      read: false
    })
    .pipe($.sitemap({
      siteUrl: global.siteUrl
    })).on('error', global.errorHandler('sitemap'))
    .pipe(gulp.dest(path.join(global.paths.dist, '/')));
});


/**
 * Generate a robots.txt file
 */
gulp.task('robots', function() {
  gulp.src(path.join(global.paths.dist, '/index.html'))
    .pipe($.robots({
      useragent: '*',
      allow: [''],
      disallow: [''],
      sitemap: global.siteUrl + '/sitemap.xml'
    })).on('error', global.errorHandler('robots'))
    .pipe(gulp.dest(path.join(global.paths.dist)));
});





/**
 * Build site (dist folder)
 */
gulp.task('build', $.sequence('clean', 'data', ['copy', 'copy:www', 'markups', 'styles', 'posts'], 'images', 'dist', 'fonts', 'sitemap', 'robots'));
