//making dev dependancies available for use
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');
var buildProduction = utilities.env.production;
var lib = require('bower-files')({
    "overrides": {
        "bootstrap": {
            "main": [
                "less/bootstrap.less",
                "dist/css/bootstrap.css",
                "dist/js/bootstrap.js"
            ]
        }
    }
});
var browserSync = require('browser-sync').create();
// var sass = require('gulp-sass');
// var sourcemaps = require('gulp-sourcemaps');

//linting all js files
gulp.task('jshint', function() {
    return gulp.src(['js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//concat js files named -interface
gulp.task('concatInterface', function() {
    return gulp.src(['./js/*-interface.js'])
        .pipe(concat('allConcat.js'))
        .pipe(gulp.dest('./tmp'));
});

//browserify the js files, concat and place them in the build folder
gulp.task('jsBrowserify', ['concatInterface'], function() {
    return browserify({
            entries: ['./tmp/allConcat.js']
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./build/js'));
});

//minification and putting them into the build folder
gulp.task("minifyScripts", ["jsBrowserify"], function() {
    return gulp.src("./build/js/app.js")
        .pipe(uglify())
        .pipe(gulp.dest("./build/js"));
});

//bower js files concatting,uglifying and moving to the build
gulp.task('jsBower', function() {
    return gulp.src(lib.ext('js').files)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

//bower css files concatting,uglifying and moving to the build
gulp.task('cssBower', function() {
    return gulp.src(lib.ext('css').files)
    pipe(concat('vendor.css'))
    pipe(gulp.dest('./build/css'));
});

gulp.task('bower', ['jsBower', 'cssBower']);

//cleaning up temp files
gulp.task('clean'function() {
    return del(['build', 'tmp']);
});

//minifyng scripts
gulp.task('build', ['clean'], function() {
    if (buildProduction) {
        gulp.start('minifyScripts');
    } else {
        gulp.start('jsBrowserify');
    }
    gulp.start('bower');
    gulp.start('cssBuild');
});

//making a server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });

    //check for changes in the directories
    gulp.watch(['js/*.js'], ['jsBuild']);
    gulp.watch(['bower.json'], ['bowerBuild']);
    gulp.watch(['*.html'], ['htmlBuild']);
    gulp.watch("scss/*.scss", ['cssBuild']);
});

//execute when any changes occur and reload the page
gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function() {
    browserSync.reload();
});
gulp.task('bowerBuild', ['bower'], function() {
    browserSync.reload();
});
gulp.task('htmlBuild', function() {
    browserSync.reload();
});
//
// //changing sass into css
// gulp.task('cssBuild', function() {
//     return gulp.src('scss/*.scss')
//         .pipe(sourcemaps.init())
//         .pipe(sass())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('.dest/build/css'))
//         .pipe(browserSync.stream());
// });
