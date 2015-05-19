/*global describe, it */
'use strict'
var expect = require('chai').expect
var fs = require('fs')
var gutil = require('gulp-util')
var codecov = require('../')

var normalContents = fs.readFileSync('test/fixtures/lcov.info')

describe('gulp-codecov.io', function () {
  describe('codecov()', function () {
    it('should send files to codecov', function (done) {
      var stream = codecov()

      var fakeFile = new gutil.File({
        base: 'test/fixtures',
        cwd: 'test/',
        path: 'test/fixtures/lcov.info',
        contents: normalContents
      })

      stream.on('error', function (err) {
        expect(err).to.exist
        done(err)
      })

      stream.on('data', function (newFile) {
        expect(newFile).to.exist
        expect(newFile.contents).to.exist
        expect(String(newFile.contents)).to.equal(fs.readFileSync('test/expected/lcov.info', 'utf8'))
        done()
      })

      stream.write(fakeFile)
      stream.end()
    })
  })
})
