const gulp = require('gulp')
const codecov = require('./index.js')

gulp.task('codecov', () => gulp.src('./coverage/lcov.info').pipe(codecov()))
