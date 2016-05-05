var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var jade        = require('gulp-jade');
var concat      = require('gulp-concat');
var reload      = browserSync.reload;


var startpaths = {
  js: './frontend/js/**/*.js',
  assets: './frontend/images/*',
  templates: ['./frontend/views/**/*.jade','!./frontend/views/includes/*'],
  html:'./frontend/views/**/*.html',
  scss: './frontend/scss/*.scss',
  node: './node_modules/**/*',
  bower: './bower_components/**/*'
};

var endpaths = {
  js: './public/js/',
  assets:'./public/images/',
  html:'./public/',
  css: './public/css/',
  node:'./public/node_modules/',
  bower: './public/bower_components/'
};


gulp.task('templates', function() {
    var YOUR_LOCALS = {};
    return gulp.src(startpaths.templates)
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty:true
    }))
    .pipe(gulp.dest(endpaths.html))
});

gulp.task('html', function() {
   return gulp.src(startpaths.html)
     .pipe(gulp.dest(endpaths.html));
});

gulp.task('assets', function() {
   return gulp.src(startpaths.assets)
     .pipe(gulp.dest(endpaths.assets));
});

gulp.task('sass', function () {
  return gulp.src(startpaths.scss)
  .pipe(sass({
    style: 'expanded',
    sourceComments: 'normal'
  }))
  .pipe(gulp.dest(endpaths.css));
  // .pipe(reload({stream: true}));
});


gulp.task('scripts', function () {
  return gulp.src(startpaths.js)
    .pipe(gulp.dest(endpaths.js));
});

gulp.task('node', function() {
    return gulp.src(startpaths.node)
        .pipe(gulp.dest(endpaths.node));
});

gulp.task('bower', function() {
    return gulp.src(startpaths.bower)
        .pipe(gulp.dest(endpaths.bower));
});

//Watches
gulp.task('jade-watch', ['templates'], reload);
gulp.task('scripts-watch', ['scripts'], reload);
gulp.task('html-watch', ['html'], reload);
gulp.task('sass-watch', ['sass'], reload);

gulp.task('default', ['sass', 'scripts','assets','templates','html', 'node', 'bower'], function () {
    browserSync({server: './public'});
    gulp.watch(startpaths.html, ['html-watch']);
    gulp.watch(startpaths.scss, ['sass-watch']);
    gulp.watch(startpaths.templates,   ['jade-watch']);
    gulp.watch(startpaths.js,      ['scripts']);
});

//utlilties
gulp.task('convert', function() {
   gulp.src(convert.source)
    .pipe(html2jade({nspaces:2,bodyless:true,donotencode:true,noemptypipe:true}))
    .pipe(gulp.dest(convert.target));
});
