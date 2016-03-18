var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', [
	'copy-html','copy-css', 'copy-js'], function() {
	// place code for your default task here
		browserSync.init({
			server: './dist'
		});
});

gulp.task('copy-html', function() {
	gulp.src('./src/*.html' )
		.pipe(gulp.dest('./dist'));
});


gulp.task('copy-css', function() {
	gulp.src('./src/css/*.css' )
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-js', function() {
	gulp.src('./src/js/*.js' )
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'));
});
