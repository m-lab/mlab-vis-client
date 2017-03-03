// For more details on DLL optimization see: https://github.com/erikras/react-redux-universal-hot-example/issues/616#issuecomment-228956242
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

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));


module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    app_assets: [
      './src/client.jsx',
    ],

    // this list is discovered by scanning the list that webpack produces
    // when you run webpack-dev-server with stats: { chunks: true, chunkModules: true }
    vendor: [
      'babel-runtime/core-js',
      'babel-polyfill',
      'react',
      'react-dom',
      'react-redux',
      'redux',
      'fbjs',
      'react-router',
      'query-string',
      'querystring',
      'strict-uri-encode',
      'react-router-redux',
      'deep-equal',
      'react-router-scroll',
      'scroll-behavior',
      'lodash',
      'lodash.curry',
      'lodash.debounce',
      'dom-helpers',
      'reselect',
      'd3-array',
      'd3-axis',
      'd3-collection',
      'd3-color',
      'd3-format',
      'd3-interpolate-path',
      'd3-line-chunked',
      'd3-scale',
      'd3-scale-interactive',
      'd3-selection',
      'd3-shape',
      'd3-time-format',
      'd3-transition',
      'd3-voronoi',
      'core-js',
      'superagent',
      'moment',
      'react-transform-hmr',
      'react-proxy',
      'react-bootstrap',
      'react-deep-force-update',
      'react-router-bootstrap',
      'global',
      'classnames',
      'keycode',
      'react-prop-types',
      'uncontrollable',
      'dom-helpers',
      'react-overlays',
      'react-helmet',
      'react-side-effect',
      'save-svg-as-png',
      'binary-search',
      'react-autosuggest',
      'shallow-equal/arrays',
      'react-autowhatever',
      'section-iterator',
      'react-themeable',
      'react-select',
      'react-input-autosize',
      'react-taco-table',
      'object-keys',
      'define-properties',
      'foreach',
      'es-abstract',
      'es-to-primitive',
      'is-callable',
      'is-date-object',
      'is-symbol',
      'function-bind',
      'is-regex',
      'object-assign',
      'symbol-observable',
      'hoist-non-react-statics',
      'invariant',
      'regenerator-runtime',
      'warning',
      'history',
      'component-emitter',
      'react-addons-shallow-compare',
      'react-moment-proptypes',
      'stable',
      'react-addons-perf',
      'strip-ansi',
      'ansi-regex',
      'ansi-html',
      'html-entities',
      'jquery',
      'bootstrap-daterangepicker',
      'react-auto-width',
      'react-tooltip'
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name].dll.js',
    library: '[name]',
    publicPath: 'http://' + host + ':' + (port - 1) + '/dist/',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-3'],
          plugins: [
            'transform-runtime',
            'transform-react-display-name',
            'transform-export-extensions',
            'transform-class-properties',
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
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join( assetsPath, '[name]-manifest.json' ),
    }),
    // do not include all momentjs locales to improve build time and size
    // note (en-us is the default and does not need to be passed in. replace
    // it with whatever other locales we need.)
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-us/),

    // optimization for faster build times
    new webpack.PrefetchPlugin('assets/base.scss'),

    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        APIROOT: JSON.stringify(process.env.APIROOT),
      },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DISABLE_SSR__: true, // <--- Ignores server-side rendering check/warning
      __DEVTOOLS__: true,  // <-------- DISABLE redux-devtools HERE
    }),
    webpackIsomorphicToolsPlugin.development(),
  ],
};
