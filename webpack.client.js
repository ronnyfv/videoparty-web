let path = require("path");
let dirname = path.resolve("./");
let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");

let vendorModules = ['jquery'];

function createConfig(isDebug) {
  let devtool = isDebug ? 'eval-source-map' : 'source-map';
  let plugins = [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")
  ];

  let cssLoader = { test: /\.css$/, loader: 'style!css' };
  let sassLoader = { test: /\.scss$/, loader: 'style!css!sass' };
  let appEntry = ['./src/client/application.js'];

  if (!isDebug) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
    plugins.push(new ExtractTextPlugin('[name].css'));

    cssLoader.loader = ExtractTextPlugin.extract('style', 'css');
    sassLoader.loader = ExtractTextPlugin.extract('style', 'css!sass');
  } else {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    appEntry.splice(0,0, 'webpack-hot-middleware/client');
  }

  return {
    devtool: devtool,
    entry: {
      application: appEntry,
      vendor: vendorModules
    },
    output: {
      path: path.join(dirname, 'public', 'build'),
      filename: '[name].js',
      publicPath: '/build/'
    },
    resolve: {
      alias: {
        shared: path.join(dirname, 'src', 'shared')
      }
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
        { test: /\.js$/, loader: 'eslint', exclude: /node_modules/ },
        { test: /\.(png|jpg|gif|jpeg|ttf|eot|svg|woff2|woff)/, loader: 'url-loader?limit=512' },
        cssLoader,
        sassLoader
      ]
    },
    plugins: plugins
  };
}

module.exports = createConfig(true);
module.exports.create = createConfig;