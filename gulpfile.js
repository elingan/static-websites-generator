var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var browserSync = require('browser-sync').create();


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


/////////////////// TASKS /////////////////////


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
 * Compile the Pug files
 */
gulp.task('pug', ['yaml'], function() {
  return gulp.src([
      path.join(conf.paths.src, '/**/*.pug'),
      path.join('!' + conf.paths.src, '/**/_*.pug')
    ])
    .pipe($.data(function() {
      return JSON.parse(fs.readFileSync(path.join(conf.paths.tmp, '/data.json')));
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
 * Compile the Stylus files
 */
gulp.task('yaml', function() {
  return gulp.src(path.join(conf.paths.src, '/**/data.yaml'))
    .pipe($.debug({title: 'yaml'}))
    .pipe($.yaml())
    .pipe($.mergeJson('data.json')).on('error', conf.errorHandler('mergeJson'))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(browserSync.stream());
});

/**
 * Copy css, js and image files to .tmp
 */
gulp.task('copy', function() {
  return gulp.src(path.join(conf.paths.src, '/**/*.{js,css,jpg,jpeg,gif,svg,png,ico}'))
    .pipe($.debug({
      title: 'copy'
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(browserSync.stream());
});

/**
 * Imagemin all images
 */
gulp.task('images', function() {
  return gulp.src(path.join(conf.paths.tmp, '/**/*.{jpg,jpeg,gif,svg,png,ico}'))
    .pipe($.debug({
      title: 'images'
    }))
    .pipe($.imagemin({
      svgoPlugins: [{
        convertPathData: false
      }]
    }))
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

  var useref = $.useref({
    //searchPath: path.join(conf.paths.src, '/public')
  });

  gulp.src(path.join(conf.paths.tmp, '/**/*.html'))
    .pipe($.jsbeautifier({
      indent_size: 2
    }))
    .pipe(htmlFilter)
    .pipe($.useref({noAssets:true})).on('error', conf.errorHandler('useref-html'))
    .pipe(htmlFilter.restore)
    .pipe(htmlIndexFilter)
    .pipe($.useref()).on('error', conf.errorHandler('useref-index'))
    .pipe($.debug({
      title: 'dist'
    }))
    .pipe(jsFilter)
    .pipe($.jsmin()).on('error', conf.errorHandler('jsmin'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.cssmin()).on('error', conf.errorHandler('cssmin'))
    .pipe(cssFilter.restore)
    .pipe(htmlIndexFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
});


/**
 * Copy server files
 */
gulp.task('config:copy', function() {

  // Cambiar esta lista con los archivos requeridos por el servidor
  var files = ['README.md', 'tile.png'];
  var src = [];
  files.forEach(function(file) {
    src.push(path.join(conf.paths.config, '/files/' + file));
  });
  return gulp.src(src)
    //.pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});


/**
 * Compile Posts
 */
gulp.task('posts', ['yaml'], function() {
  return gulp.src('./src/**/*.md')
    .pipe($.frontMatter())
    .pipe($.markdown())
    // QUITAR frontMatter
    .pipe($.layout(function(file) {
      var data = JSON.parse(fs.readFileSync(path.join(conf.paths.tmp, '/data.json')));
      data.layout = path.join(conf.paths.src, '/', path.dirname(file.relative), file.frontMatter.layout);
      return data;
    })).on('error', conf.errorHandler('posts:layout'))
    .pipe($.debug({
      title: 'post'
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
    .pipe(browserSync.stream());
});


/////////////////// MAIN TASKS /////////////////////


/**
 * Serve the Site
 * Watch styles, scripts and images
 */
gulp.task('serve', ['clean', 'copy', 'pug', 'stylus', 'posts'], function() {
  browserSync.init({
    server: conf.paths.tmp
      //proxy: 'localhost:9000'
  });
  gulp.watch(path.join(conf.paths.src, '/**/*.md'), ['posts'])
  gulp.watch(path.join(conf.paths.src, '/**/*.yaml'), ['pug'])
  gulp.watch(path.join(conf.paths.src, '/**/*.pug'), ['pug', 'posts'])
  gulp.watch(path.join(conf.paths.src, '/**/*.styl'), ['stylus'])
  gulp.watch(path.join(conf.paths.src, '/**/*.{js,css,jpg,jpeg,gif,svg,png,ico}'), ['copy'])

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
gulp.task('build', $.sequence('clean', ['copy', 'pug', 'stylus', 'posts'], 'images', 'dist', 'config:copy'));


/**
 * Push build to s3 repository
 */
gulp.task('publish', function() {

  var credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
  var publisher = $.awspublish.create(credentials, {
    cacheFileName:'.publish.cache'
  });

  // create a new publisher
  return gulp.src(path.join(conf.paths.dist, '/**/*'))
    .pipe(publisher.publish())
    //.pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe($.awspublish.reporter())
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the harp site, launch BrowserSync & watch files.
 */
gulp.task('default', ['serve']);
