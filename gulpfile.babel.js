import gulp from "gulp";
import webpack from "webpack";
import chalk from "chalk";
import rimraf from "rimraf";
import { create as createServerConfig } from "./webpack.server";
import { create as createClientConfig } from "./webpack.client";

let $ = require("gulp-load-plugins")();

// public tasks
gulp.task('clean:server', cb => rimraf('./build', cb));
gulp.task('clean:client', cb => rimraf('./public/build', cb));
gulp.task('clean', gulp.parallel('clean:server', 'clean:client'));


gulp.task('dev:server', gulp.series('clean:server', devServerBuild));
gulp.task('dev', gulp
  .series(
    'clean',
    devServerBuild,
    gulp.parallel(
      devServerWatch,
      devServerReload)));

gulp.task('prod:server', gulp.series('clean:server', prodServerBuild));
gulp.task('prod:client', gulp.series('clean:client', prodClientBuild));
gulp.task('prod', gulp
  .series(
    'clean',
    gulp.parallel(
      prodServerBuild,
      prodClientBuild)));

// private client tasks
let prodClientWebpack = webpack(createClientConfig(false));

function prodClientBuild(callback) {
  prodClientWebpack.run((error, stats) => {
    outputWebpack('prod:client', error, stats);
    callback();
  });
}

// private server tasks
let devServerWebpack = webpack(createServerConfig(true));
let prodServerWebpack = webpack(createServerConfig(false));

function devServerBuild(callback) {
  devServerWebpack.run((error, stats) => {
    outputWebpack('dev:server', error, stats);
    callback();
  });
}

function devServerWatch() {
  devServerWebpack.watch({}, (error, stats) => {
    outputWebpack('dev:server', error, stats);
  });
}

function devServerReload() {
  return $.nodemon({
    script: './build/server.js',
    watch: './build/',
    env: {
      'NODE_ENV': 'development',
      'USE_WEBPACK': 'true'
    }
  });
}

function prodServerBuild(callback) {
  prodServerWebpack.run((error, stats) => {
    outputWebpack('prod:server', error, stats);
    callback();
  });
}


// helpers
function outputWebpack(label, error, stats) {
  if (error)
    throw new Error(error);

  if (stats.hasErrors()) {
    $.util.log(stats.toString({ colors: true }));
  } else {
    let time = stats.endTime - stats.startTime;
    $.util.log(chalk.bgGreen(`Build ${label} in ${time} ms`));
  }
}