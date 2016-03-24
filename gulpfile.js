var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('default', [
	'copy-html','copy-css', 'copy-js', 'copy-js-lib'], function() {
	// place code for your default task here

});

gulp.task('copy-html', function() {
	gulp.src('./src/*.html' )
		.pipe(gulp.dest('./dist'));
});


gulp.task('copy-css', function() {
	gulp.src('./src/sass/*.scss' )
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-js', function() {
	gulp.src('./src/js/*.js' )
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('copy-js-lib', function() {
	gulp.src('./src/js/lib/*.js' )
		.pipe(gulp.dest('./dist/js/lib'));
});
