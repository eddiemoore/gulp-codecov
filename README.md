[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency Status][depstat-image]][depstat-url] [![Dev Dependency Status][devdepstat-image]][devdepstat-url]

# gulp-codecov

[Gulp](https://github.com/wearefractal/gulp) plugin to submit code coverage to [Codecov.io](http://codecov.io).

## Usage

First, install `gulp-codecov` as a dev dependency:

```bash
$ npm install --save-dev gulp-codecov
```

Then, add it to your `gulpfile.js`:

```javascript
var codecov = require('gulp-codecov');

gulp.src('./coverage/lcov.info')
  .pipe(codecov());
```

## License

[MIT License](http://mit-license.org)

[npm-url]: https://npmjs.org/package/gulp-codecov
[npm-image]: https://img.shields.io/npm/v/gulp-codecov.svg?style=flat-square

[travis-url]: http://travis-ci.org/eddiemoore/gulp-codecov
[travis-image]: https://img.shields.io/travis/eddiemoore/gulp-codecov/master.svg?style=flat-square

[codecov-url]: https://codecov.io/github/eddiemoore/gulp-codecov
[codecov-image]: https://img.shields.io/codecov/c/github/eddiemoore/gulp-codecov/master.svg?style=flat-square

[depstat-url]: https://david-dm.org/eddiemoore/gulp-codecov
[depstat-image]: https://img.shields.io/david/eddiemoore/gulp-codecov/master.svg?style=flat-square

[devdepstat-url]: https://david-dm.org/eddiemoore/gulp-codecov#info=devDependencies
[devdepstat-image]: https://img.shields.io/david/dev/eddiemoore/gulp-codecov/master.svg?style=flat-square
