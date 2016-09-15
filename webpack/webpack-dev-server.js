var Express = require('express');
var webpack = require('webpack');

var config = require('../src/config');
var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);

var host = config.host || 'localhost';
var port = (Number(config.port) + 1) || 3001;
var serverOptions = {
  contentBase: 'http://' + host + ':' + port,
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: {
    colors: true,
    assets: true,
    version: true,
    hash: true,
    timings: true,

    // set these to true to see more verbose output
    chunks: false,
    chunkModules: false,
  },
};

var useDashboard = !!process.env.WEBPACK_DASHBOARD;
var hotOptions;

if (useDashboard) {
  var Dashboard = require('webpack-dashboard');
  var DashboardPlugin = require('webpack-dashboard/plugin');
  var dashboard = new Dashboard();
  compiler.apply(new DashboardPlugin(dashboard.setData));
  hotOptions = {
    log: function noop() {},
  };
  serverOptions.quiet = true;
  serverOptions.noInfo = true;
  serverOptions.stats = {
    // Config for minimal console.log mess.
    colors: true,
    assets: false,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
  };
}

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler, hotOptions));

app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else if (!useDashboard) {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
