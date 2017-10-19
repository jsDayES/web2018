'use strict';

var gulp        = require ('gulp');
var path        = require ('path');
var fs          = require ('fs');
var $           = require ('gulp-load-plugins')();
var runSequence = require ('run-sequence');
var webserver   = require ('gulp-webserver');
var merge       = require ('merge-stream');
var del         = require ('del');
var i18n        = require ('gulp-html-i18n');
var addsrc      = require('gulp-add-src');

var paths = {
    yaml   : './lang/**/*.yaml',
    html   : './*.html',
    koliseo : ['./js/koliseo-agenda.js', './js/koliseo-polyfill.js'],
    fonts  : [
        './font-awesome/fonts/*.*',
        './bootstrap/fonts/*.*'
    ],
    css    : [
        './bootstrap/css/bootstrap.min.css',
        './font-awesome/css/font-awesome.min.css',
        'css/flexslider.css',
        'css/owl.carousel.css',
        'css/jquery-ui.min.css',
        'css/style.css',
        'css/kagenda-styles.css',
        'css/custom.css',
        'css/codigo-page.css'
    ],
    code    : [
        'css/custom.css',
        'css/codigo-page.css'
    ],
    js     : [
        './js/jquery.min.js',
        './bootstrap/./js/bootstrap.min.js',
        './js/jquery.easing.1.3.min.js',
        './js/jquery.backstretch.min.js',
        './js/jquery.flexslider-min.js',
        './js/owl.carousel.min.js',
        './js/masonry.pkgd.min.js',
        './js/jquery-ui.min.js',
        './js/pace.min.js',
        './js/wow.min.js',
        './js/jqBootstrapValidation.js',
        './node_modules/blazy/blazy.js',
        './js/custom.js',
        './js/jquery.countdown.min.js'
    ],
    images : './img/**/*',
    dist   : './dist/'
};

gulp.task ('clean', function () {
    return del ([
        './dist/**',
    ]);
});

gulp.task ('images', function () {
    return gulp.src (paths.images)
        .pipe ($.imagemin ({ progressive: true }))
        .pipe (gulp.dest (paths.dist + '/img/'));
});

gulp.task ('ico', function () {
    return gulp.src (['favicon.png', 'favicon.ico'])
        .pipe (gulp.dest (paths.dist));
});

gulp.task ('js', function () {
    return gulp.src (paths.js)
        .pipe ($.concat ('main.js',{newLine: ';'}))
        .pipe ($.uglify ())
        .pipe (gulp.dest (paths.dist + '/js/'));
});

gulp.task ('koliseo', function () {
    return gulp.src (paths.koliseo)
        .pipe (gulp.dest (paths.dist + '/js/'));
});

gulp.task ('css', function () {
    var page =  gulp.src (paths.css)
        .pipe ($.concat ('main.css'))
        .pipe ($.cssmin ())
        .pipe (gulp.dest (paths.dist + '/css/'));

    var codePage = gulp.src (paths.code)
        .pipe ($.concat ('main-conduct.css'))
        .pipe ($.cssmin ())
        .pipe (gulp.dest (paths.dist + '/css/'));

    return merge(page, codePage);
});

gulp.task ('fonts', function () {
    return gulp.src (paths.fonts)
        .pipe (gulp.dest(paths.dist + '/fonts'));
});

gulp.task ('html', function () {
    return gulp.src ([
            'index.html',
            'codigodeconducta.html',
            'codeofconduct.html',
            'call-for-proposals-en.html',
            'call-for-proposals-es.html'
        ])
        .pipe(i18n({
            createLangDirs: true,
            defaultLang: 'en',
            langDir: './lang',
            trace: true,
        }))
        .pipe ($.useref ())
        .pipe ($.minifyHtml ({
            quotes : true,
            empty  : true,
            spare  : true
    }))
    .pipe(gulp.dest (paths.dist))
});

gulp.task ('build', ['images', 'ico', 'fonts', 'koliseo', 'js', 'css', 'html']);

gulp.task ('server', function () {
    gulp.src ('.')
        .pipe (webserver ({
            port             : 5000,
            livereload       : false,
            directoryListing : {
                enable : false,
            },
            open             : 'index.html'
        }));
});

gulp.task ('server:dist', ['dist'], function () {
    gulp.src ('dist/')
        .pipe (webserver ({
            port             : 5000,
            livereload       : false,
            directoryListing : {
                enable : false,
            }
        }));
});

gulp.task ('dist', function (cb) {
    runSequence ('clean', 'build', cb);
});

gulp.task('watch', function() {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.yaml, ['html']);
});


gulp.task('default',  function (cb) {
    runSequence ('build', 'watch', 'server:dist', cb);
});
