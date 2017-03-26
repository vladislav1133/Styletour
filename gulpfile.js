var gulp         = require('gulp'),
    sass         = require('gulp-sass');
    browserSync  = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq         = require('gulp-group-css-media-queries');


    gulp.task('sass', function(){
      return gulp.src('app/sass/**/*.scss')
      .pipe(sass())
      .pipe(autoprefixer(['last 15 versions','> 1%', 'ie 8', 'ie 7'], {cascade: true}))
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({stream: true}))
    });

    gulp.task('browser-sync', function(){
      browserSync({
        server: {
          baseDir: 'app'
        },
        notify: false
      });
    });

    gulp.task('mediaq', function () {
        gulp.src('app/css/main.css')
            .pipe(gcmq())
            .pipe(gulp.dest('dist'));
    });

    gulp.task('watch',['browser-sync', 'sass'], function() {//2param ['brow..'] вызов таска перед функцией
      gulp.watch('app/sass/**/*.scss', ['sass']);
      gulp.watch('app/*.html', browserSync.reload);
      gulp.watch('app/js/**/*.js', browserSync.reload);
    });
