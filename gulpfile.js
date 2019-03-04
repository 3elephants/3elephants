var gulp = require('gulp');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
function processReact() {
  // place code for your default task here
  let scriptsList = [
    'react-sandbox/node_modules/react/cjs/react.production.min.js',
    'react-sandbox/node_modules/react-dom/cjs/react-dom.production.min.js',
    './react-sandbox/src/components/*'
  ];
  return (
    gulp.src(vendorList)
    .pipe(babel({
      only: [
        'assets/js/src/components/*',
      ],
      presets: ['@babel/env', '@babel/preset-react']
    }))
    .pipe(concat('components.js'))
    .pipe(gulp.dest('./3Elephants/'))
  )
}

//TODO: create a bundler task

exports.default = processReact
