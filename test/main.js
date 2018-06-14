/* global describe, it, beforeEach, afterEach */
'use strict'
const expect = require('chai').expect
const fs = require('fs')
const es = require('event-stream')
const Vinyl = require('vinyl')
const sinon = require('sinon')
const codecov = require('codecov')
const gulpCodecov = require('../')

describe('gulp-codecov', () => {
  process.env.TRAVIS = 'true'
  process.env.TRAVIS_JOB_ID = '1234'
  process.env.TRAVIS_COMMIT = '5678'
  process.env.TRAVIS_JOB_NUMBER = '91011'
  process.env.TRAVIS_BRANCH = 'master'
  process.env.TRAVIS_PULL_REQUEST = 'blah'
  process.env.TRAVIS_REPO_SLUG = 'owner/repo'

  describe('success', () => {
    beforeEach(() => {
      sinon.stub(codecov.handleInput, 'upload').callsArgWith(1, 'success')
    })

    afterEach(() => {
      codecov.handleInput.upload.restore && codecov.handleInput.upload.restore()
    })

    it('should pass the file through via buffer', done => {
      const srcFile = new Vinyl({
        base: 'test/fixtures',
        cwd: 'test/',
        path: 'test/fixtures/lcov.info',
        contents: fs.readFileSync('test/fixtures/lcov.info')
      })

      const stream = gulpCodecov()

      stream.once('error', err => {
        expect(err).to.exist // eslint-disable-line
        done(err)
      })

      stream.once('data', newFile => {
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

    it('should send the file contents to Codecov', done => {
      const srcFile = new Vinyl({
        path: 'test/fixtures/lcov.info',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/lcov.info')
      })

      const stream = gulpCodecov()
      stream.write(srcFile)
      stream.end()

      stream.once('data', () => {
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

  describe('when Codecov responds with an error', () => {
    beforeEach(() => {
      sinon.stub(codecov.handleInput, 'upload').callsArgWith(2, {
        stack: 'err',
        detail: 'non-success response',
        message: 'non-success response'
      })
    })

    afterEach(() => {
      codecov.handleInput.upload.restore && codecov.handleInput.upload.restore()
    })

    it('should emit an error', done => {
      const srcFile = new Vinyl({
        path: 'test/fixtures/lcov.info',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/lcov.info')
      })

      const stream = gulpCodecov()

      stream.once('error', error => {
        expect(error).to.exist // eslint-disable-line
        done()
      })

      stream.write(srcFile)
      stream.end()
    })
  })

  describe('nulls', () => {
    beforeEach(() => {
      sinon.stub(codecov.handleInput, 'upload')
    })

    afterEach(() => {
      codecov.handleInput.upload.restore && codecov.handleInput.upload.restore()
    })

    it('should pass the file through when null', done => {
      const nullFile = new Vinyl()

      const stream = gulpCodecov()

      stream.once('data', newFile => {
        expect(newFile).to.exist // eslint-disable-line
        sinon.assert.notCalled(codecov.handleInput.upload)
        done()
      })

      stream.write(nullFile)
      stream.end()
    })
  })

  describe('streams', () => {
    it('should error on stream', done => {
      const srcFile = new Vinyl({
        path: 'test/fixtures/lcov.info',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.createReadStream('test/fixtures/lcov.info')
      })

      const stream = gulpCodecov()

      stream.on('error', err => {
        expect(err).to.exist // eslint-disable-line
        done()
      })

      stream.on('data', newFile => {
        newFile.contents.pipe(
          es.wait((err, data) => {
            done(err)
          })
        )
      })

      stream.write(srcFile)
      stream.end()
    })
  })
})
