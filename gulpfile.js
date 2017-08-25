var gulp = require("gulp"),
	jade = require("gulp-jade"),
	styl = require("gulp-stylus"),
	browserSync = require("browser-sync").create(),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	rjs,
	gulpIf = require("gulp-if"),
	sourcemaps = require("gulp-sourcemaps"),
	nano = require("gulp-cssnano"),
	addsrc = require('gulp-add-src');

var
	IS_DEVELOPMENT = false,
	VENDOR_CSS_PATHS = [
		"node_modules/bootstrap/dist/css/bootstrap.css",
		"node_modules/nouislider/distribute/nouislider.css",
		"node_modules/bootstrap-star-rating/css/star-rating.css",
		"node_modules/fancybox/source/jquery.fancybox.css",
		"node_modules/toastr/toastr.css",
		"src/styles/fontello.css",
		"src/styles/flaticon.css"
	],
	DEPLOY_BASE_PATH = "dist",
	SCRIPT_PATHS = [
		"node_modules/jquery/dist/jquery.js",
		"node_modules/toastr/toastr.js",
		"node_modules/bootstrap/dist/js/bootstrap.js",
		"node_modules/nouislider/distribute/nouislider.js",
		"node_modules/bootstrap-star-rating/js/star-rating.js",
		"node_modules/knockout/dist/knockout.debug.js",
		"node_modules/hammerjs/hammer.js",
		"node_modules/fancybox/source/jquery.fancybox.js",
		"node_modules/goodshare.js/goodshare.js",
		"src/scripts/models.js",
		"src/scripts/requestHandler.js",
		"src/scripts/main.js"
	],
	SCRIPTS_DEPLOY_PATH = DEPLOY_BASE_PATH + "/js",
	STYLES_DEPLOY_PATH = DEPLOY_BASE_PATH + "/css",
	FONTS_DEPLOY_PATH = DEPLOY_BASE_PATH + "/fonts",
	IMAGES_DEPLOY_PATH = DEPLOY_BASE_PATH;

gulp.task("markup", function () {
	return gulp.src("src/markup/*.jade")
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest("dist"));
});

gulp.task("fonts", function () {
	return gulp.src([
		"node_modules/bootstrap/fonts/*",
		"src/fonts/*/*",
		"src/fonts/*.{eot,svg,ttf,woff,woff2}"
	])
		.pipe(gulp.dest(FONTS_DEPLOY_PATH));
});

gulp.task("images", function () {
	return gulp.src([
		"src/{icons,images}/**/*.{jpg,png,gif,svg}"
	]).pipe(gulp.dest(IMAGES_DEPLOY_PATH));
});
gulp.task("styles:fancybox", function () {
	return gulp.src([
		"node_modules/fancybox/source/*.{jpg,png,gif,svg}"
	]).pipe(gulp.dest(STYLES_DEPLOY_PATH));
});

gulp.task("styles", ["styles:fancybox"], function () {
	var responseStream = gulp.src("src/styles/main.styl")
		.pipe(gulpIf(IS_DEVELOPMENT, sourcemaps.init()))
		.pipe(styl());
	if (!IS_DEVELOPMENT) {
		for (var i = 0; i < VENDOR_CSS_PATHS.length; i++) {
			var currPath = VENDOR_CSS_PATHS[i];
			responseStream = responseStream.pipe(addsrc.prepend(currPath));
		}
	}
	return responseStream
		.pipe(concat("app.min.css"))
		.pipe(gulpIf(!IS_DEVELOPMENT, nano()))
		.pipe(gulpIf(IS_DEVELOPMENT, sourcemaps.write()))
		.pipe(gulp.dest(STYLES_DEPLOY_PATH))
		.pipe(browserSync.stream());
});

gulp.task("deploy:styles", ["styles"], function () {
	return gulp.src(["dist/css/app.min.css", "dist/css/*.{jpg,png,gif,svg}"])
		.pipe(gulp.dest(STYLES_DEPLOY_PATH));
});

gulp.task("deploy:scripts", ["scripts"], function () {
	return gulp.src("dist/js/app.min.js")
		.pipe(gulp.dest(SCRIPTS_DEPLOY_PATH));
});

gulp.task("deploy", ["deploy:styles", "deploy:scripts"]);

gulp.task("styles-vendor", function (cb) {
	if (!IS_DEVELOPMENT) {
		cb();
		return;
	}

	return gulp.src(VENDOR_CSS_PATHS)
		.pipe(concat("vendor.min.css"))
		.pipe(nano())
		.pipe(gulp.dest(STYLES_DEPLOY_PATH));
});

gulp.task("scripts", function () {
	return gulp.src(SCRIPT_PATHS)
		.pipe(concat("app.min.js"))
		.pipe(gulpIf(!IS_DEVELOPMENT, uglify()))
		.pipe(gulp.dest(SCRIPTS_DEPLOY_PATH))
});

gulp.task("watch", function () {

	browserSync.init({
		server: "dist"
	});

	gulp.watch("src/**/*.jade", ["markup"]);
	gulp.watch("dist/**/*.html").on("change", browserSync.reload);
	gulp.watch("dist/**/*.js").on("change", browserSync.reload);

	gulp.watch("src/styles/**/*.styl", ["styles"]);
	gulp.watch("src/scripts/**/*.js", ["scripts"]);

});

gulp.task("build", ["styles", "styles-vendor", "fonts", "images", "scripts", "markup"]);
gulp.task("default", ["build", "watch"]);