/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split into several files in the gulp directory
 *  because putting it all here was too long
 */

'use strict';

var gulpTasks = require('require-dir')
var gulp = require('gulp');

// create Browser Sync instance
var bs = require('browser-sync').create('MyBS');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});


/**
 *  Console arguments
 */
var args = require('yargs').argv;

/**
 *  Meta values for siteUrl and analyticsId
 */
global.siteUrl = 'http://example.com';
global.analyticsId = 'X-99999-X';
global.env = (args.production) ? 'production' : 'development';

/**
 * AWS Credentials
 */
 global.credentials = {
   params: {
     Bucket: 'cambio.sumaqwebsites.com'
   },
   region: 'eu-central-1'
 }

/**
 *  The main paths of your project handle these with care
 */
global.paths = {
  src: 'src',
  tmp: '.tmp',
  dist: 'dist',
  config: 'config'
}

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
global.errorHandler = function(title) {
  'use strict';
  return function(err) {
    $.util.log($.util.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  }
}



/**
 *  load all gulp tasks
 */
gulpTasks('./tasks');


/**
 *  Launch default task
 */
gulp.task('default', function() {
  gulp.start('serve');
});
