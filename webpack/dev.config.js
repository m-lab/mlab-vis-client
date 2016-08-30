require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var assetsPath = path.resolve(__dirname, '../static/dist');
var host = (process.env.HOST || 'localhost');
var port = (+process.env.PORT + 1) || 3001;
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// read in developer settings if available
var developerSettings;
try {
  developerSettings = JSON.parse(fs.readFileSync(path.join(__dirname,
    '..', 'developer-settings.json'), 'utf8')).webpack;
} catch (e) { /* ignore if not there */ }
developerSettings = developerSettings || {};

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}


var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development;

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
if (babelrcObjectDevelopment) {
  combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);
}

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, {plugins: combinedPlugins});
delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
var reactTransform = null;
for (var i = 0; i < babelLoaderQuery.plugins.length; ++i) {
  var plugin = babelLoaderQuery.plugins[i];
  if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
    reactTransform = plugin;
  }
}

if (!reactTransform) {
  reactTransform = ['react-transform', { transforms: [] }];
  babelLoaderQuery.plugins.push(reactTransform);
}

if (!reactTransform[1] || !reactTransform[1].transforms) {
  reactTransform[1] = Object.assign({}, reactTransform[1], { transforms: [] });
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module'],
});

// ensure PureComponent super class is there
reactTransform[1].superClasses = ['React.Component', 'Component',
  'React.PureComponent', 'PureComponent'];

module.exports = {
  devtool: developerSettings.devtool || 'cheap-module-eval-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    main: [
      'webpack-hot-middleware/client?overlay=false&path=http://' + host + ':' + port + '/__webpack_hmr',
      './src/client.jsx',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel?' + JSON.stringify(babelLoaderQuery)] },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.less$/, loader: 'style!css!postcss!less' },
      { test: /\.scss$/, loader: 'style!css!postcss!sass' },
      { test: /\.css$/, loader: 'style!css!postcss' },
      { test: /\.(woff)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' },
    ],
  },

  // add in vendor prefixes
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],

  progress: true,
  resolve: {
    root: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ],
    extensions: ['', '.js', '.jsx'],
  },
  // Can be constructed with __dirname and path.join.
  recordsPath: path.join(__dirname, 'webpack-records.json'),
  plugins: [
    new HardSourceWebpackPlugin({
      // Either an absolute path or relative to output.path.
      cacheDirectory: path.join(__dirname, 'cache'),
    }),
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DISABLE_SSR__: true, // <--- Ignores server-side rendering check/warning
      __DEVTOOLS__: true,  // <-------- DISABLE redux-devtools HERE
    }),
    webpackIsomorphicToolsPlugin.development(),
  ],
};
