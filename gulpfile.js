var gulp = require('gulp'),
    utils = require('gulp-util'),
    concat = require('gulp-concat'),
    closureCompiler = require('gulp-closure-compiler'),
    dependencies = require('gulp-resolve-dependencies'),
    runSequence = require('run-sequence'),
    inject = require('gulp-inject'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    zip = require('gulp-zip'),
    size = require('gulp-size'),
    addsrc = require('gulp-add-src'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),

    mime = require('mime'),
    remove = require('del'),

    packageJSON = require('./package.json');

gulp.task('concatenate', function () {
  return gulp.src('./js/*.js')
    .pipe(dependencies({
        pattern: /@requires [\s-]*(.*?\.js)/g
    }).on('error', utils.log))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('minify-js', function () {
  return gulp.src('./tmp/app.js')
      .pipe(closureCompiler({
          compilerPath: './compiler.jar',
          fileName: 'app.min.js',
          compilerFlags: {
              compilation_level: 'ADVANCED_OPTIMIZATIONS',
              warning_level: 'QUIET'
          }
      }))
      .pipe(gulp.dest('./tmp/'));
});

gulp.task('minify-css', function () {
    return gulp.src('./css/*.css')
        .pipe(concat('app.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./tmp'));
});

gulp.task('prepare-html', function () {
  return gulp.src('./game.html')
    .pipe(inject(gulp.src(['./tmp/*.min.js', './tmp/*.min.css']), {
        starttag: '<!-- inject:{{ext}} -->',
        transform: function (filePath, file) {
            var mimeType = mime.lookup(filePath),
                contents = file.contents.toString('utf8');
            switch (mimeType) {
                case 'application/javascript':
                    return '<script>' + contents + '</script>';
                case 'text/css':
                    return '<style>' + contents + '</style>';
                default:
                    throw new Error('Uknonwn mime type (' + mimeType + '): ' + filePath);
            }
        }
    }))
    .pipe(rename('index.html'))
    .pipe(minifyHTML())
    .pipe(zip(packageJSON.name + '.zip'))
    .pipe(size())
    .pipe(gulp.dest('./build'));
});

gulp.task('prepare-html-dev', function () {
    return gulp.src('./game.html')
        .pipe(inject(
            gulp.src('./js/*.js')
            .pipe(dependencies({
                pattern: /@requires [\s-]*(.*?\.js)/g
            }).on('error', utils.log))
            .pipe(addsrc('./css/*.css'))
        ))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'))
        .pipe(connect.reload());
});

gulp.task('clean-tmp', function (callback) {
    remove(['./tmp'], callback);
});

gulp.task('clean-build', function (callback) {
    remove(['./build'], callback);
});

gulp.task('webserver', function () {
  connect.server({
      livereload: true
  });
});

gulp.task('reload', function () {
    gulp.src('./index.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./game.html', './js/*.js', './css/*.css'], ['prepare-html-dev']);
  gulp.watch('index.html', ['reload']);
});

gulp.task('dev', function (callback) {
  runSequence('prepare-html-dev', 'webserver', 'watch', callback);
});

gulp.task('build', function (callback) {
    runSequence('clean-build', 'concatenate', 'minify-js', 'minify-css', 'prepare-html', 'clean-tmp', callback);
});
