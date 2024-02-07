const gulp = require("gulp");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const print = require("gulp-print").default;
const stylus = require("gulp-stylus");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const pug = require("gulp-pug");
const pugInheritance = require("gulp-pug-inheritance");
const data = require("gulp-data");
const $ = require("gulp-load-plugins")();
const fs = require("fs");

// Пути
const src = {
	app: {
		folder: "./app/",
		html: "./app/**/*.html",
		pug: "./app/pug/*.pug",
		stylus: "./app/stylus/",
		js: "./app/js/",
		images: "./app/images/**/*.+(png|jpg|jpeg|gif|svg|ico)",
		fonts: "./app/fonts/**/*.*",
		node_modules: "./node_modules/",
	},
	dist: {
		folder: "./prod/",
		css: "./prod/static/css",
		js: "./prod/static/js",
		images: "./prod/static/images",
		fonts: "./prod/static/fonts",
		node_modules: "./prod/node_modules/",
	},
};

const node_dependencies = Object.keys(
	require("./package.json").dependencies || {}
);

gulp.task("clear", () => del([src.dist.folder]));

gulp.task("html", () => {
	return gulp
		.src([src.app.html], {
			base: src.app.folder,
			since: gulp.lastRun("html"),
		})
		.pipe(gulp.dest(src.dist.folder))
		.pipe(browserSync.stream());
});

gulp.task("pug", () => {
	return gulp
		.src(src.app.pug)
		.pipe(
			$.changed(src.dist.folder, {
				extension: ".html",
			})
		)
		.pipe($.if(global.isWatching, $.cached("pug")))
		.pipe(
			pugInheritance({
				basedir: src.app.folder + "pug",
				skip: "node_modules",
			})
		)
		.pipe(plumber())
		.pipe(
			data((file) => {
				return JSON.parse(
					fs.readFileSync(src.app.folder + "pug/includes/data/data.json")
				);
			})
		)
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(src.dist.folder))
		.pipe(browserSync.stream());
});

gulp.task("stylus", () => {
	return gulp
		.src(src.app.stylus + "styles.styl")
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(
			stylus({
				"include css": true,
				compress: false,
			})
		)
		.pipe(
			autoprefixer({
				grid: "autoplace",
			})
		)
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(src.dist.css))
		.pipe(browserSync.stream());
});

gulp.task("images", () => {
	return gulp
		.src([src.app.images], { since: gulp.lastRun("images") })
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest(src.dist.images))
		.pipe(browserSync.stream());
});

gulp.task("js-own", () => {
	return (
		gulp
			.src([src.app.js + "script.js"], { since: gulp.lastRun("js") })
			.pipe(sourcemaps.init())
			.pipe(
				babel({
					presets: ["@babel/preset-env"],
					minified: false,
					//minified: true
				})
			)
			.pipe(
				plumber({
					errorHandler: $.notify.onError({
						title: "JS error",
						message: "<%= error.message %>",
					}),
				})
			)
			.pipe(
				notify({
					title: "JS-babel",
					message: "JS-babel complete",
				})
			)
			.pipe(
				$.changed(src.dist.js, {
					extension: ".js",
				})
			)
			.pipe(print())
			.pipe(concat("own.js"))
			//.pipe($.uglify())
			.pipe(sourcemaps.write("./"))
			.pipe(gulp.dest(src.dist.js))
			.pipe(
				notify({
					title: "JS",
					message: "JS build complete",
					onLast: true,
				})
			)
			.pipe(browserSync.stream())
	);
});

gulp.task("css-vendor", () => {
	return gulp
		.src([
			"node_modules/magnific-popup/dist/magnific-popup.css",
			"node_modules/swiper/dist/css/swiper.css",
			"node_modules/jquery-form-styler/dist/jquery.formstyler.css",
			"node_modules/jquery-form-styler/dist/jquery.formstyler.theme.css",
		])
		.pipe(sourcemaps.init())
		.pipe(
			plumber({
				errorHandler: $.notify.onError({
					title: "CSS-vendor",
					message: "error: <%= error.message %>",
				}),
			})
		)
		.pipe(print())
		.pipe(concat("vendor.css"))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(src.dist.css))
		.pipe(
			notify({
				title: "CSS-vendor",
				message: "CSS-vendor build complete",
				onLast: true,
			})
		)
		.pipe(browserSync.stream());
});

gulp.task("js-vendor", () => {
	return (
		gulp
			.src([
				"node_modules/jquery/dist/jquery.js",
				"node_modules/jquery-migrate/dist/jquery-migrate.js",
				"node_modules/jquery-form-styler/dist/jquery.formstyler.min.js",
				"node_modules/swiper/dist/js/swiper.js",
				"node_modules/magnific-popup/dist/jquery.magnific-popup.js",
				src.app.js + "libs/jquery.maskedinput.min.js",
				src.app.js + "libs/jquery.tipsy.js",
			])
			.pipe(sourcemaps.init())
			.pipe(
				plumber({
					errorHandler: notify.onError({
						title: "JS-vendor",
						message: "error: <%= error.message %>",
					}),
				})
			)
			.pipe(
				$.changed(src.dist.js, {
					extension: ".js",
				})
			)
			.pipe(print())
			.pipe(concat("vendor.js"))
			// .pipe(uglify())
			.pipe(sourcemaps.write("./"))
			.pipe(gulp.dest(src.dist.js))
			.pipe(
				notify({
					title: "JS-vendor",
					message: "JS-vendor complete",
					onLast: true,
				})
			)
			.pipe(browserSync.stream())
	);
});

gulp.task("js", gulp.series("js-vendor", "js-own"));

gulp.task("styles", gulp.series("css-vendor", "stylus"));

gulp.task("fonts", (done) => {
	gulp.src(src.app.fonts).pipe(gulp.dest(src.dist.fonts));
	done();
});

gulp.task(
	"build",
	gulp.series("clear", "html", "pug", "styles", "js", "images", "fonts")
);

gulp.task("dev", gulp.series("html", "pug", "stylus", "js-own"));

gulp.task("serve", () => {
	return browserSync.init({
		server: {
			baseDir: ["./prod"],
			directory: true,
		},
	});
});

gulp.task("watch", () => {
	const watchImages = [src.app.images];

	const watchVendor = [];

	node_dependencies.forEach((dependency) => {
		watchVendor.push(src.app.node_modules + dependency + "/**/*.*");
	});

	// const watch = [src.app.html, src.app.pug, src.app.stylus, src.app.js];
	// gulp.watch(watch, gulp.series("dev")).on("change", browserSync.reload);

	gulp.watch([src.app.html], gulp.series("html"));
	// .on("change", browserSync.reload);

	gulp.watch([src.app.pug], gulp.series("pug"));
	// .on("change", browserSync.reload);

	gulp.watch([src.app.stylus], gulp.series("stylus"));
	// .on("change", browserSync.reload);

	gulp.watch([src.app.js], gulp.series("js-own"));
	// .on("change", browserSync.reload);

	gulp
		.watch(watchImages, gulp.series("images"))
		.on("change", browserSync.reload);

	gulp
		.watch(watchVendor, gulp.series("js-own"))
		.on("change", browserSync.reload);
});

// gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
gulp.task("default", gulp.parallel("serve", "watch"));
