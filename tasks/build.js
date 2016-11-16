var gulp = require('gulp');
var path = require('path');
// var bs = require('browser-sync').create();

var conf = require('./conf');

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
 * Delete dist and tmp folder
 */
gulp.task('clean', function() {
  $.del.sync([
    path.join(conf.paths.dist, '/'),
    path.join(conf.paths.tmp, '/')
  ]);
});


/**
 * Copy css, js, fonts and image files to .tmp
 */
gulp.task('copy', function() {
  return gulp.src([
    path.join(conf.paths.src, '/**/*.{js,css,jpg,jpeg,gif,svg,png,ico,eot,ttf,woff,woff2,otf}'),
    path.join('!' + conf.paths.src, '/_seo/*')
  ])
    .pipe($.debug({
      title: 'copy'
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    // .pipe(bs.stream());
});


/**
 * Imagemin for all images
 */
gulp.task('images', function() {
  return gulp.src(path.join(conf.paths.tmp, '/**/*.{jpg,jpeg,gif,svg,png,ico}'))
    .pipe($.imagemin([
      imageminGifsicle(),
      imageminJpegoptim({
        progressive: true,
        max: 50
      }),
      imageminOptipng(),
      imageminSvgo()
    ], {
      verbose: true,
    })).on('error', conf.errorHandler('imagemin'))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
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

  gulp.src(path.join(conf.paths.tmp, '/**/*.html'))
    .pipe($.jsbeautifier({
      indent_size: 2
    }))
    // toma como referencia index.html para procesar css y js
    .pipe(htmlIndexFilter)
    .pipe($.useref()).on('error', conf.errorHandler('useref-index'))
    .pipe($.debug({title: 'dist'}))
    .pipe(jsFilter)
    .pipe($.jsmin()).on('error', conf.errorHandler('jsmin'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.cssmin()).on('error', conf.errorHandler('cssmin'))
    .pipe(cssFilter.restore)
    .pipe(htmlIndexFilter.restore)
    // restaura y procesa todos los html
    .pipe(htmlFilter)
    .pipe($.useref({noAssets: true})).on('error', conf.errorHandler('useref-html'))
    .pipe($.htmlmin()).on('error', conf.errorHandler('htmlmin'))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
});


/**
 * Copy all fonts
 */
gulp.task('fonts', function() {
  return gulp.src(path.join(conf.paths.tmp, '/assets/fonts/*.{svg,eot,ttf,woff,woff2,otf}'))
    .pipe($.debug({
      title: 'fonts'
    }))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/fonts')));
});


/**
 * Copy css, js, fonts and image files to .tmp
 */
gulp.task('seo', function() {
  return gulp.src(path.join(conf.paths.src, '/_seo/*'))
    .pipe($.debug({title: 'seo'}))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    // .pipe(bs.stream());
});


/**
 * Generate a sitemap.xml file
 */
gulp.task('sitemap', function () {
    gulp.src(path.join(conf.paths.tmp, '/**/*.html'), {read: false
        })
        .pipe($.sitemap({
            siteUrl: conf.siteUrl
        })).on('error', conf.errorHandler('sitemap'))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});


/**
 * Generate a robots.txt file
 */
gulp.task('robots', function () {
    gulp.src(path.join(conf.paths.tmp, '/index.html'))
        .pipe($.robots({
            useragent: '*',
            allow: [''],
            disallow: [''],
            sitemap: conf.siteUrl + '/sitemap.xml'
        })).on('error', conf.errorHandler('robots'))
        .pipe(gulp.dest(path.join(conf.paths.dist)));
});





/**
 * Build site (dist folder)
 */
gulp.task('build', $.sequence('clean', ['copy', 'seo', 'markups', 'styles', 'posts'], 'images', 'dist', 'fonts', 'sitemap', 'robots'));
