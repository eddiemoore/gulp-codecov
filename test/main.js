/* global describe, it, beforeEach, afterEach */
'use strict'
var expect = require('chai').expect
var fs = require('fs')
var es = require('event-stream')
var gutil = require('gulp-util')
var sinon = require('sinon')
var codecov = require('codecov')
var gulpCodecov = require('../')

describe('gulp-codecov', function() {
  process.env.TRAVIS = 'true'
  process.env.TRAVIS_JOB_ID = '1234'
  process.env.TRAVIS_COMMIT = '5678'
  process.env.TRAVIS_JOB_NUMBER = '91011'
  process.env.TRAVIS_BRANCH = 'master'
  process.env.TRAVIS_PULL_REQUEST = 'blah'
  process.env.TRAVIS_REPO_SLUG = 'owner/repo'

  describe('success', function() {
    beforeEach(function() {
      sinon.stub(codecov.handleInput, 'upload').callsArgWith(1, 'success')
    })

    afterEach(function() {
      codecov.handleInput.upload.restore && codecov.handleInput.upload.restore()
    })

    it('should pass the file through via buffer', function(done) {
      var srcFile = new gutil.File({
        base: 'test/fixtures',
        cwd: 'test/',
        path: 'test/fixtures/lcov.info',
        contents: fs.readFileSync('test/fixtures/lcov.info')
      })

      var stream = gulpCodecov()

      stream.once('error', function(err) {
        expect(err).to.exist // eslint-disable-line
        done(err)
      })

      stream.once('data', function(newFile) {
        expect(newFile).to.exist // eslint-disable-line
        expect(newFile.contents).to.exist // eslint-disable-line
        expect(String(newFile.contents)).to.equal(
          fs.readFileSync('test/expected/lcov.info', 'utf8')
        )
        done()
      })

      stream.write(srcFile)
      stream.end()
    })

    it('should send the file contents to Codecov', function(done) {
      var srcFile = new gutil.File({
        path: 'test/fixtures/lcov.info',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/lcov.info')
      })

      var stream = gulpCodecov()
      stream.write(srcFile)
      stream.end()

      stream.once('data', function() {
        sinon.assert.calledOnce(codecov.handleInput.upload)
        sinon.assert.calledWith(
          codecov.handleInput.upload,
          {
            options: {
              file: 'test/fixtures/lcov.info'
            }
          },
          sinon.match.func,
          sinon.match.func
        )
        done()
      })
    })
  })

  describe('when Codecov responds with an error', function() {
    beforeEach(function() {
      sinon.stub(codecov.handleInput, 'upload').callsArgWith(2, {
        stack: 'err',
        detail: 'non-success response',
        message: 'non-success response'
      })
    })

    afterEach(function() {
      codecov.handleInput.upload.restore && codecov.handleInput.upload.restore()
    })

    it('should emit an error', function(done) {
      var srcFile = new gutil.File({
        path: 'test/fixtures/lcov.info',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/lcov.info')
      })

      var stream = gulpCodecov()

      stream.once('error', function(error) {
        expect(error).to.exist // eslint-disable-line
        done()
      })

      stream.write(srcFile)
      stream.end()
    })
  })

  describe('nulls', function() {
    beforeEach(function() {
      sinon.stub(codecov.handleInput, 'upload')
    })

    afterEach(function() {
      codecov.handleInput.upload.restore && codecov.handleInput.upload.restore()
    })

    it('should pass the file through when null', function(done) {
      var nullFile = new gutil.File()

      var stream = gulpCodecov()

      stream.once('data', function(newFile) {
        expect(newFile).to.exist // eslint-disable-line
        sinon.assert.notCalled(codecov.handleInput.upload)
        done()
      })

      stream.write(nullFile)
      stream.end()
    })
  })

  describe('streams', function() {
    it('should error on stream', function(done) {
      var srcFile = new gutil.File({
        path: 'test/fixtures/lcov.info',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.createReadStream('test/fixtures/lcov.info')
      })

      var stream = gulpCodecov()

      stream.on('error', function(err) {
        expect(err).to.exist // eslint-disable-line
        done()
      })

      stream.on('data', function(newFile) {
        newFile.contents.pipe(
          es.wait(function(err, data) {
            done(err)
          })
        )
      })

      stream.write(srcFile)
      stream.end()
    })
  })
})
