import gulp from "gulp";
import del from "del";
import sass from "gulp-sass";
import minify from "gulp-csso";
import autoprefixer from "gulp-autoprefixer";
import ws from "gulp-webserver";
import gpug from "gulp-pug";

sass.compiler = require("node-sass");

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/**/*.pug",
    dest: "dist",
  },
  css: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/styles.scss",
    dest: "dist/css",
  },
  reset: {
    src: "src/reset.css",
    dest: "dist/css",
  },
};

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: "autoplace",
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const reset = () =>
  gulp.src(routes.reset.src).pipe(minify()).pipe(gulp.dest(routes.reset.dest));

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const watch = () => {
  gulp.watch(routes.css.watch, styles);
  gulp.watch(routes.pug.watch, pug);
};

const webserver = () => gulp.src("dist").pipe(ws({ livereload: true }));

const clean = () => del(["dist/styles.css", "dist/index.html"]);

const prepare = gulp.series([clean]);

const assets = gulp.series([reset, styles, pug]);

const postDev = gulp.parallel([webserver]);

const live = gulp.parallel([watch]);

export const dev = gulp.series([prepare, assets, postDev, live]);
