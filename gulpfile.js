var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var browserSync = require('browser-sync').create();

const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegoptim = require('imagemin-jpegoptim');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');

var argv = require('yargs').argv;


/////////////////// CONFIGURATION /////////////////////

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});


/**
 *  Configuration options
 */
var conf = {

  /**
   *  Change values for siteUrl and analyticsId
   */
  siteUrl:'http://generator.sumaqwebsites.com',
  analyticsId:'X-99999-X',

  env: (argv.production)?'production':'development',

  /**
   *  The main paths of your project handle these with care
   */
  paths: {
    src: 'src',
    tmp: '.tmp',
    dist: 'dist',
    config: 'config'
  },

  /**
   *  Common implementation for an error handler of a Gulp plugin
   */
  errorHandler: function(title) {
    'use strict';
    return function(err) {
      $.util.log($.util.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  }
};


/////////////////// SINGLE TASKS /////////////////////

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
 * Compile the Pug files
 */
gulp.task('pug', ['yaml'], function() {
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
    .pipe($.pug({
      pretty: true
    })).on('error', conf.errorHandler('pug:pug'))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(browserSync.stream());
});

/**
 * Compile the Stylus files
 */
gulp.task('stylus', function() {
  return gulp.src(path.join(conf.paths.src, '/**/*.styl'))
    .pipe($.debug({
      title: 'stylus'
    }))
    .pipe($.stylus())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(browserSync.stream());
});

/**
 * Compile the YAML files
 */
gulp.task('yaml', function() {
  return gulp.src(path.join(conf.paths.src, '/**/data.yaml'))
    .pipe($.debug({
      title: 'yaml'
    }))
    .pipe($.yaml())
    .pipe($.mergeJson('data.json')).on('error', conf.errorHandler('mergeJson'))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(browserSync.stream());
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
    .pipe(browserSync.stream());
});

/**
 * Copy css, js, fonts and image files to .tmp
 */
gulp.task('seo', function() {
  return gulp.src(path.join(conf.paths.src, '/_seo/*'))
    .pipe($.debug({title: 'seo'}))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(browserSync.stream());
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
  var htmlFilter = $.filter(['**/*.html', '!index.html'], {
    restore: true
  });
  var htmlIndexFilter = $.filter('index.html', {
    restore: true
  });
  // var htmlMinFilter = $.filter('**/*.html', {
  //   restore: true
  // });

  // var useref = $.useref({
  //   //searchPath: path.join(conf.paths.src, '/public')
  // });

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
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
});


// /**
//  * Copy server files
//  */
// gulp.task('config:copy', function() {
//
//   // Cambiar esta lista con los archivos requeridos por el servidor
//   var files = ['README.md', 'tile.png'];
//   var src = [];
//   files.forEach(function(file) {
//     src.push(path.join(conf.paths.config, '/files/' + file));
//   });
//   return gulp.src(src)
//     //.pipe($.flatten())
//     .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
// });


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

/////////////////// MAIN TASKS /////////////////////


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


/**
 * Build site (dist folder)
 */
gulp.task('build', $.sequence('clean', ['copy', 'seo', 'pug', 'stylus', 'posts'], 'images', 'dist', 'fonts', 'sitemap', 'robots'));


/**
 * Push build to s3 repository
 */
gulp.task('publish', function() {

  var credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
  var publisher = $.awspublish.create(credentials, {
    cacheFileName: '.publish.cache'
  });

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=2592000, no-transform, public'
  };

  // create a new publisher
  return gulp.src(path.join(conf.paths.dist, '/**/*'))
    .pipe($.awspublish.gzip())
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    //.pipe(publisher.cache())
    .pipe($.awspublish.reporter())
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the harp site, launch BrowserSync & watch files.
 */
gulp.task('default', ['serve']);
