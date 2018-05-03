const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const tsify = require('tsify');
const ngannotate = require('browserify-ngannotate');
const connect = require('gulp-connect');

gulp.task('ts', function() {
    const bundler = browserify({
            basedir: '.',
            entries: ['src/index.ts']
        })
        .plugin(tsify, {
            module: 'none'
        })
        .transform('browserify-shim', { global: true })
        .transform(ngannotate, { ext: ['.ts', '.js'] });


    return bundler.bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('connect', function() {
    connect.server({
        port: 7777
    });
});

gulp.task('default', ['ts']);