'use strict';

var gulp        = require ('gulp');
var path        = require ('path');
var fs          = require ('fs');
var $           = require ('gulp-load-plugins')();
var runSequence = require ('run-sequence');
var webserver   = require ('gulp-webserver');
var merge       = require ('merge-stream');
var del         = require ('del');
var addsrc      = require('gulp-add-src');
var YAML = require('yamljs');
var critical = require('critical').stream;

var paths = {
    yaml   : './lang/**/*.yaml',
    html   : './templates/**/*.html',
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
        './js/lazy-load-image.js',
        './js/jquery.min.js',
        './bootstrap/./js/bootstrap.min.js',
        './js/jquery.backstretch.min.js',
        './js/owl.carousel.min.js',
        './js/custom.js'
    ],
    images : './img/**/*',
    dist   : './dist/'
};

var isProd = false;

gulp.task ('clean', function () {
    return del ([
        './dist/**',
    ]);
});

gulp.task ('images', function () {
    return gulp.src (paths.images)
        .pipe($.if(isProd, $.imagemin ([
            $.imagemin.jpegtran({progressive: true}),
            $.imagemin.optipng({optimizationLevel: 7})            
        ])))
        .pipe (gulp.dest (paths.dist + '/img/'));
});

gulp.task ('ico', function () {
    return gulp.src (['favicon.png', 'favicon.ico'])
        .pipe (gulp.dest (paths.dist));
});

gulp.task ('js', function () {
    return gulp.src (paths.js)
        .pipe ($.concat ('main.js',{newLine: ';'}))
        .pipe($.if(isProd, $.uglify().on('error', function(err) {
            console.log(err.toString());
            this.emit('end');
        })))
        .pipe (gulp.dest (paths.dist + '/js/'));
});

gulp.task ('koliseo', function () {
    return gulp.src (paths.koliseo)
        .pipe (gulp.dest (paths.dist + '/js/'));
});

gulp.task ('css', function () {
    var page =  gulp.src (paths.css)
        .pipe ($.concat ('main.css'))
        .pipe($.if(isProd, $.cssmin()))
        .pipe (gulp.dest (paths.dist + '/css/'));

    var codePage = gulp.src (paths.code)
        .pipe ($.concat ('main-conduct.css'))
        .pipe($.if(isProd, $.cssmin()))
        .pipe (gulp.dest (paths.dist + '/css/'));

    return merge(page, codePage);
});

gulp.task('critical', function () {
  return gulp.src('dist/*.html')
        .pipe(critical({
            inline: true,
            base: 'dist/',
            minify: true,
            dimensions: [
            {
                height: 1050,
                width: 1980
            },                
            {
                height: 1024,
                width: 768
            }, {
                height: 1024,
                width: 980
            },
            {
                height: 736,
                width: 414
            }],            
            css: ['dist/css/main.css']
        }))
        .on('error', function(err) {
            console.error(err.message);
        })
        .pipe(gulp.dest('dist'));
});

gulp.task ('fonts', function () {
    return gulp.src (paths.fonts)
        .pipe (gulp.dest(paths.dist + '/fonts'));
});

function html(lang) {
    var config = JSON.parse(JSON.stringify(require('./config.json')));
    var dist = paths.dist;
    var root = '/';
    var langFile;
    if (lang === 'es') {
        langFile = YAML.load('./lang/es/text.yaml');
        dist = dist + 'es';
        root = '/es/';
    } else {
        langFile = YAML.load('./lang/en/text.yaml');
    }

    config.text = langFile;
    config.lang = lang;   
    config.root = root;

    return gulp.src([
        'templates/pages/index.html',
        'templates/pages/*-' + lang +'.html'
    ])       
    .pipe($.nunjucksRender({
        path: ['templates/'],
        data: config
    }))  
    .pipe($.if(isProd, $.minifyHtml({
        quotes : true,
        empty  : true,
        spare  : true
    })))
    .pipe(gulp.dest(dist));
};

gulp.task ('html-en', function () {
    return html('en');
});

gulp.task ('html-es', function () {
    return html('es');
});

gulp.task ('build', ['images', 'ico', 'fonts', 'koliseo', 'js', 'css', 'html-en', 'html-es']);

gulp.task ('server', function () {
    gulp.src ('dist/')
        .pipe (webserver ({
            port             : 5000,
            livereload       : false,
            directoryListing : {
                enable : false,
            }
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
    gulp.watch([paths.html, paths.yaml], ['html-en', 'html-es']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.yaml, ['html-es', 'html-en']);
});


gulp.task('dev',  function (cb) {
    isProd = false;
    runSequence ('clean', 'build', 'watch', 'server:dist', cb);
});

gulp.task('default',  function (cb) {
    isProd = true;
    runSequence ('dist', cb);
});
