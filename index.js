'use strict'
var through = require('through2')
var gutil = require('gulp-util')
var codecov = require('codecov')

var PLUGIN_NAME = 'gulp-codecov'

module.exports = function (opts) {
  return through.obj(function (file, enc, callback) {
    function sendToCodecov (path, done) {
      var options = opts || {}
      options.file = path
      codecov.handleInput.upload({
        options: options
      }, function (res) {
        return done(null, file)
      }, function (err) {
        return done(new gutil.PluginError(PLUGIN_NAME, err || 'Could not upload'))
      })
    }

    if (file.isNull()) {
      this.push(file)
      return callback()
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Stream content is not supported'))
      return callback()
    }

    if (file.isBuffer()) {
      sendToCodecov(file.path, callback)
      this.push(file)
    }
  })
}
