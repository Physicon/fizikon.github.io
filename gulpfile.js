var gulp           = require('gulp'),
gutil          = require('gulp-util' ),
sass           = require('gulp-sass'),
browserSync    = require('browser-sync'),
concat         = require('gulp-concat'),
uglify         = require('gulp-uglify'),
cleanCSS       = require('gulp-clean-css'),
rename         = require('gulp-rename'),
del            = require('del'),
imagemin       = require('gulp-imagemin'),
cache          = require('gulp-cache'),
autoprefixer   = require('gulp-autoprefixer'),
notify         = require("gulp-notify"),
njkRender      = require('gulp-nunjucks-render'),
prettify       = require('gulp-html-prettify');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
	})
});

gulp.task('sass', function() {
	return gulp.src('app/sass/libs.sass')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass_main', function() {
	return gulp.src(['!app/sass/libs.sass', 'app/sass/**/*.sass'])
	.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js'
		])
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src([
		'app/libs/vue/dist/vue.js',
		'app/libs/axios/dist/axios.min.js'
		])
	.pipe(concat('scripts.min.js'))
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('nunjucks', function() {
	return gulp.src('njk/*.njk')
	.pipe(njkRender())
	.pipe(prettify({
		indent_size : 4
	}))
	.pipe(gulp.dest('app'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('sass', 'sass_main'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('js', 'common-js'));
	gulp.watch('njk/**/*.njk', gulp.parallel('nunjucks'));
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('default', gulp.parallel('sass', 'sass_main', 'js', 'common-js', 'nunjucks', 'browser-sync', 'watch'));

gulp.task('build', function(done) {
	var delDist = del.sync('dist');
	var buildFiles = gulp.src(['app/*.html']).pipe(gulp.dest('dist'));
	var buildCss = gulp.src(['app/css/libs.min.css', 'app/css/main.css']).pipe(gulp.dest('dist/css'));
	var buildJs = gulp.src(['app/js/scripts.min.js', 'app/js/common.js']).pipe(gulp.dest('dist/js'));
	var buildFonts = gulp.src(['app/fonts/**/*']).pipe(gulp.dest('dist/fonts'));
	var buildIms = gulp.src('app/img/**/*').pipe(cache(imagemin())).pipe(gulp.dest('dist/img'));
	done();
});