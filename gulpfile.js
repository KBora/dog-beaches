var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();



gulp.task('default', ['copy-html','copy-css', 'copy-js', 'copy-img', 'watch-everything'], function() {

	// place code for your default task here
	browserSync.init({
		server: './dist'
	});
});


gulp.task('watch-everything', function() {
	gulp.watch('./src/*.html', ['copy-html']);
	gulp.watch('./src/sass/*.scss', ['copy-css']);
	gulp.watch('./src/js/*.js', ['copy-js']);
	gulp.watch('./src/js/lib/*.js', ['copy-js-lib']);
	gulp.watch('./src/img/*', ['copy-img']);
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
	//	.pipe(uglify())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('copy-js-lib', function() {
	gulp.src('./src/js/lib/*.js' )
		.pipe(gulp.dest('./dist/js/lib'));
});

gulp.task('copy-img', function() {
	gulp.src('./src/img/*' )
		.pipe(gulp.dest('./dist/img'));
});