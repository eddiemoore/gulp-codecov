var gulp = require('gulp')
var codecov = require('./index.js')

gulp.task('codecov', function () {
  return gulp.src('./coverage/lcov.info')
    .pipe(codecov())
})
