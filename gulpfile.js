var gulp = require('gulp');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");


gulp.task('lint', function () {
  return gulp.src('./airbop-client.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});


gulp.task('compress', function() {
  return gulp.src('./airbop-client.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('.'));
});


gulp.task('default', []);
