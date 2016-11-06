var gulp = require('gulp');
var path = require('path');

var conf = require('./conf');

// Load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

var argv = require('yargs').argv;

/**
 *  Configuration options
 */
// var conf = {

/**
 *  Change values for siteUrl and analyticsId
 */
exports.siteUrl = 'http://generator.sumaqwebsites.com';
exports.analyticsId = 'X-99999-X';

exports.env = (argv.production) ? 'production' : 'development';

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  tmp: '.tmp',
  dist: 'dist',
  config: 'config'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';
  return function(err) {
    $.util.log($.util.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
// };
