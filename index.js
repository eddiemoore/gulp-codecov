'use strict'
const through = require('through2')
const PluginError = require('plugin-error')
const codecov = require('codecov')

const PLUGIN_NAME = 'gulp-codecov'

module.exports = opts =>
  through.obj(function (file, enc, callback) {
    const sendToCodecov = (path, done) => {
      const options = opts || {}
      options.file = path
      codecov.handleInput.upload(
        { options },
        () => done(null, file),
        err => done(new PluginError(PLUGIN_NAME, err))
      )
    }

    if (file.isNull()) {
      this.push(file)
      return callback()
    }

    if (file.isStream()) {
      this.emit(
        'error',
        new PluginError(PLUGIN_NAME, 'Stream content is not supported')
      )
      return callback()
    }

    if (file.isBuffer()) {
      sendToCodecov(file.path, callback)
      this.push(file)
    }
  })
