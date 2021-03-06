var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imageMin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq         = require('gulp-group-css-media-queries');

//1) Build main.min.css
gulp.task('sass', function(){
  return gulp.src('app/sass/**/*.scss')
  .pipe(sass())
  .pipe(autoprefixer(['last 15 versions','> 1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(gcmq())
  .pipe(cssnano())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

//Build libs.min.cs
gulp.task('css-libs',['sass'], function(){
  return gulp.src('app/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
});

//3) Build libs.min.js
gulp.task('scripts',function(){
  return gulp.src([
    'app/libs/elastislide/modernizr.custom.17475.js',
    'app/libs/elastislide/jquery.elastislide.js'
  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'));
});

//Clean dist
gulp.task('clean', function(){
  return del.sync('dist');
});

//Clean cache
gulp.task('cache-clean',function () {
  return cache.clearAll();
});

//Optimize images
gulp.task('img',function(){
  return gulp.src('app/img/**/*')
  .pipe(cache(imageMin({
    interlaced: true,
    progressive: true,
    svgoPlagins:[{removeViewBox: false}],
    une:[pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('watch',['browser-sync', 'css-libs','scripts'], function() {
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});



gulp.task('build',['clean','img','css-libs','scripts'],function(){

  var buildCss = gulp.src([
    'app/css/bootstrap.min.css',
    'app/css/libs.min.css',
    'app/css/main.css'
  ])
  .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});
