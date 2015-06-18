var gulp = require('gulp'),
    $    = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'del', 'wiredep', 'main-bower-files']
    });

gulp.task('clean', function () {
  $.del('public')
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
var randomPort = getRandomInt(3000,65536);

gulp.task('connect', function() {
    $.connect.server({
    port: randomPort,
    root: 'public',
    livereload: true
  });
});

gulp.task('html', function() {
    gulp
    .src('public/*.html')
    .pipe($.connect.reload());
});

gulp.task('open', function(){
  gulp
  .src('public/*.html')
  .pipe($.open(), {app: 'google chrome'});
});

gulp.task('wiredep', function () {
  gulp
    .src('src/**/*.jade')
    .pipe(wiredep({
      directory: './bower_components/',
      bowerJson: require('./bower.json'),
    }))
    .pipe(gulp.dest('public/lib'));
});

gulp.task('bower:js', function () {
  gulp
    .src($.mainBowerFiles('**/*.js'))
    .pipe($.concat('build.js'))
    .pipe(gulp.dest('public/lib'));
});

gulp.task('babel:dev', function () {
  return gulp
    .src('src/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.concat('main.js'))
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('babel:prod', function () {
  return gulp
    .src('src/**/*.js')
    .pipe($.concat('main.js'))
    .pipe($.babel())
    .pipe(gulp.dest('public/js'));
});

gulp.task('uglify', function () {
  gulp
    return gulp
    .src('lib/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('public/lib/build.js'));
});

gulp.task('jade:dev', function () {
  gulp
    .src(['src/**/*.jade'])
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('jade:prod', function () {
  gulp
    .src(['src/**/*.jade'])
    .pipe($.jade({
      outputstyle: 'compressed'
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('bower:css', function () {
  gulp
    .src($.mainBowerFiles('**/*.css')
    .pipe($.concat('build.css'))
    .pipe(gulp.dest('public/lib'))
  )
});

gulp.task('cssmin', function() {
  return gulp
    .src('./src/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.minifyCss())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass:dev', function () {
  gulp
    .src('src/_styles/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass:prod', function () {
  gulp
    .src('src/_styles/main.scss')
    .pipe($.sass({
        outputStyle: 'compressed'
      })
      .on('error', $.sass.logError)
    )
    .pipe(gulp.dest('public/css'));
});

gulp.task('autoprefixer', function () {
  gulp
    return gulp
    .src('public/css/main.css')
    .pipe($.autoprefixer({
      browsers: ['>1%'],
      cascade: true
    }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('build:dev', ['clean', 'jade:dev', 'sass:dev', 'bower:css', 'bower:js', 'autoprefixer', 'uglify', 'babel:dev']);

gulp.task('build:prod', ['clean', 'jade:prod', 'sass:prod', 'bower:css', 'bower:js', 'autoprefixer', 'uglify', 'babel:prod', 'cssmin']);

gulp.task('serve', ['build:dev', 'connect' , 'open' , 'watch']);

gulp.task('watch', function () {
  gulp.watch('src/**/*.jade', ['jade:dev']);
  gulp.watch('src/**/*.scss', ['sass:dev', 'autoprefixer']);
  gulp.watch('src/**/*.js', ['babel:dev']);
  gulp.watch('src/**/*.js', ['bower:js']);
  gulp.watch('public/*', ['html']);
});

gulp.task('default', function() {});
