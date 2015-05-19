'use strict'
var through = require('through2')
var gutil = require('gulp-util')
var codecov = require('codecov.io')

var PLUGIN_NAME = 'gulp-codecov.io'

module.exports = function () {
  return through.obj(function (file, enc, callback) {

    function sendToCodecov (input, done) {
      codecov.handleInput(input, function (err) {
        if (err) {
          return done(new gutil.PluginError(PLUGIN_NAME, err))
        }
        return done(null, file)
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
      sendToCodecov(file.contents.toString(), callback)
      this.push(file)
    }
  })
}
