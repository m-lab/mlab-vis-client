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
    filename: 'main.js',
    publicPath: 'http://' + host + ':' + port + '/dist/',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            'transform-runtime',
            'transform-react-display-name',
            ['react-transform',
              {
                transforms: [{
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module'],
                }],
                superClasses: ['React.Component', 'Component',
                  'React.PureComponent', 'PureComponent'],
              },
            ],
          ],
        },
      },
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
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, '..'),
      manifest: require(path.join(assetsPath, 'vendor-manifest.json')),
    }),

    // do not include all momentjs locales to improve build time and size
    // note (en-us is the default and does not need to be passed in. replace
    // it with whatever other locales we need.)
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-us/),

    // optimization for faster build times
    new webpack.PrefetchPlugin('assets/base.scss'),

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
      __DEBUG_COMPUTED_PROPS__: false,
    }),
  ],
};
