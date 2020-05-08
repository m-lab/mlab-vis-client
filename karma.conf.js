var webpack = require('webpack');

module.exports = function (config) {
  config.set({

    browsers: ['PhantomJS'],
    singleRun: !!process.env.CI,

    frameworks: [ 'mocha', 'sinon' ],

    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'src/**/*-test.js',
      'src/**/*-test.jsx'
    ],
    
    // TODO: Stop excluding component tests once incident data is being passed in by the API. The sample incident JSON file causes Karma to fail.
    exclude: [
      'src/components/__tests__/*-test.jsx'
    ],

    preprocessors: {
      'src/**/*-test.js': ['webpack', 'sourcemap'],
      'src/**/*-test.jsx': ['webpack', 'sourcemap'],
    },

    reporters: [ 'mocha' ],

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-phantomjs-launcher"),
      require("karma-sourcemap-loader"),
      require("karma-sinon")
    ],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: {limit: 10240} },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets: ['react', 'es2015', 'stage-3'],
              plugins: [
                'transform-export-extensions',
                'transform-class-properties',
              ]
            }
          },
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.less$/, loader: 'style!css!less' },
          { test: /\.scss$/, loader: 'style!css!sass' },
          { test: /\.css$/, loader: 'style!css' },
          { test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url', query: {limit: 10240} },
        ]
      },
      resolve: {
        modulesDirectories: [
          'src',
          'node_modules'
        ],
        extensions: ['', '.json', '.js', '.jsx']
      },
      plugins: [
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: true,
          __DISABLE_SSR__: false, // <--- Ignores server-side rendering check/warning
          __DEVTOOLS__: false,  // <-------- DISABLE redux-devtools HERE
          __DEBUG_COMPUTED_PROPS__: false,
        })
      ],
      externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
    },

    webpackServer: {
      noInfo: true
    }

  });
};
