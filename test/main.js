/*global describe, it */
'use strict'
var expect = require('chai').expect
var fs = require('fs')
var gutil = require('gulp-util')
var gulpCodecov = require('../')

describe('gulp-codecov.io', function () {
  describe('codecov()', function () {
    process.env.TRAVIS = 'true'
    process.env.TRAVIS_JOB_ID = '1234'
    process.env.TRAVIS_COMMIT = '5678'
    process.env.TRAVIS_JOB_NUMBER = '91011'
    process.env.TRAVIS_BRANCH = 'master'
    process.env.TRAVIS_PULL_REQUEST = 'blah'
    process.env.TRAVIS_REPO_SLUG = 'owner/repo'

    it('should pass the file through via buffer', function (done) {
      var fakeFile = new gutil.File({
        base: 'test/fixtures',
        cwd: 'test/',
        path: 'test/fixtures/lcov.info',
        contents: fs.readFileSync('test/fixtures/lcov.info')
      })

      var stream = gulpCodecov()

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
