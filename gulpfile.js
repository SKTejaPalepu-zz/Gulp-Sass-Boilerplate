var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');
var runSequence = require('run-sequence');


gulp.task('sass', function(){
    return gulp.src('./src/stylesheets/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
  });

gulp.task('useref', function(){
return gulp.src('src/html/**/*.html')
    .pipe(useref())
     // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});


gulp.task('images', function(){
    return gulp.src('./src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin({
        // Setting interlaced to true
        interlaced: true
      }))
    .pipe(gulp.dest('dist/images'))
  });

gulp.task('fonts', function() {
    return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function() {
    return del.sync('dist');
  })

gulp.task('watch', ['browserSync', 'sass'],  function(){
    gulp.watch('./src/stylesheets/**/*.scss', ['sass']); 
    // Reloads the browser whenever HTML or JS files change
    gulp.watch("src/html/**/*.html").on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload); 
})

gulp.task('build', function (callback) {
    runSequence('clean:dist', 
      ['sass', 'useref', 'images', 'fonts'],
      callback
    )
  })

gulp.task('browserSync', function() {
    browserSync.init({
      server: {
        baseDir: ['./src/html', './dist/css']//add all folders you wanna serve
      },
    });
})

gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch'],
        callback
    )
})