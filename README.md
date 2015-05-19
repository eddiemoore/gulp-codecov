[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency Status][depstat-image]][depstat-url] [![Dev Dependency Status][devdepstat-image]][devdepstat-url]

# gulp-codecov.io

[Gulp](https://github.com/wearefractal/gulp) plugin to submit code coverage to [Codecov.io](http://codecov.io).

## Usage

First, install `gulp-codecov.io` as a dev dependency:

```bash
$ npm install --save-dev gulp-codecov.io
```

Then, add it to your `gulpfile.js`:

```javascript
var codecov = require('gulp-codecov.io');

gulp.src('./coverage/lcov.info')
  .pipe(codecov());
```

## License

[MIT License](http://mit-license.org)

[npm-url]: https://npmjs.org/package/gulp-codecov.io
[npm-image]: https://img.shields.io/npm/v/gulp-codecov.io.svg?style=flat-square

[travis-url]: http://travis-ci.org/eddiemoore/gulp-codecov.io
[travis-image]: https://img.shields.io/travis/eddiemoore/gulp-codecov.io/master.svg?style=flat-square

[codecov-url]: https://codecov.io/github/eddiemoore/gulp-codecov.io
[codecov-image]: https://img.shields.io/codecov/c/github/eddiemoore/gulp-codecov.io/master.svg?style=flat-square

[depstat-url]: https://david-dm.org/eddiemoore/gulp-codecov.io
[depstat-image]: https://img.shields.io/david/eddiemoore/gulp-codecov.io/master.svg?style=flat-square

[devdepstat-url]: https://david-dm.org/eddiemoore/gulp-codecov.io#info=devDependencies
[devdepstat-image]: https://img.shields.io/david/dev/eddiemoore/gulp-codecov.io/master.svg?style=flat-square
