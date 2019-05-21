"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("image-min", function() {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("webp-make", function() {
  return gulp.src("build/img/**/*.{jpg, png}")
    .pipe(webp({quiality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite-make", function () {
  return gulp.src("source/img/icon-*.svg")
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(rename("iconsprite.svg"))
  .pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([ include() ]))
    .pipe(gulp.dest("build"));
});

gulp.task("copy-js", function() {
  return gulp.src("source/*.js", {
    base: "source"
  })
  .pipe(gulp.dest("build"));
})

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite-make", "html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("copy-js", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("copy", function() {
  return gulp.src([
    "source/css/normalize.css",
    "source/fonts/**/*.{woff,woff2}",
    "source/js/**",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clear", function() {
  return del("build");
});

gulp.task("img", gulp.series("image-min", "sprite-make", "webp-make"));
gulp.task("build", gulp.series("clear", "copy", "img", "css", "html"));
gulp.task("start", gulp.series("build", "server"));
