'use strict'
var through = require('through2')
var path = require('path')
var gutil = require('gulp-util')
var codecov = require('codecov.io')

var PLUGIN_NAME = 'gulp-codecov.io'

function Codecov (options) {
  options = options || {}

  return through.obj(function (file, enc, cb) {
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'))
    }
    if (file.isNull()) {
      return cb(null, file)
    }
    if (path.extname(file.path) !== '.lcov' && path.extname(file.path) !== '.json') {
      return cb(null, file)
    }

    codecov(file.contents, function (err) {
      if (err) {
        console.log('error sending to codecov.io: ', err, err.stack)
        if (/non-success response/.test(err.message)) {
          console.log('detail: ', err.detail)
        } else {
          console.log('SUCCESS')
        }
        return cb(new gutil.PluginError(PLUGIN_NAME, err))
      }
      return cb(null, file)
    })
  })
}

module.exports = Codecov
