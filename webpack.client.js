let path = require("path");
let dirname = path.resolve("./");
let webpack = require("webpack");

// 'jquery'
let vendorModules = [];

function createConfig(isDebug) {
  let devtool = isDebug ? 'eval-source-map' : 'source-map';
  let plugins = [new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')];

  let cssLoader = { test: /\.css$/, loader: 'style!css' };
  let sassLoader = { test: /\.scss$/, loader: 'style!css!sass' };
  let appEntry = ['./src/client/application.js'];

  return {
    devtool: devtool,
    entry: {
      vendor: vendorModules,
      application: appEntry
    },
    output: {
      path: path.join(dirname, 'public', 'build'),
      filename: '[name].js',
      public: '/build/'
    },
    resolve: {
      alias: {
        shared: path.join(__dirname, 'src', 'shared')
      }
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
        { test: /\.js$/, loader: 'eslint', exclude: /node_modules/ },
        { test: /\.(png|jpg|gif|jpeg|ttf|eot|svg|woff2|woff)/, loader: 'url-loader?limit=512' },
        cssLoader,
        sassLoader
      ],
      externals: [],
      plugins: plugins
    }
  };
}

module.exports = createConfig(true);
module.exports.create = createConfig;