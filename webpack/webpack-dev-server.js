var Express = require('express');
var webpack = require('webpack');
var Dashboard = require('webpack-dashboard');
var DashboardPlugin = require('webpack-dashboard/plugin');

var config = require('../src/config');
var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);

var dashboard = new Dashboard();
compiler.apply(new DashboardPlugin(dashboard.setData));

var host = config.host || 'localhost';
var port = (Number(config.port) + 1) || 3001;
var serverOptions = {
  contentBase: 'http://' + host + ':' + port,
  quiet: true, // quiet needed for webpack-dashboard
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: {
    // Config for minimal console.log mess.
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
  },
};

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
// override log for webpack-dashboard
app.use(require('webpack-hot-middleware')(compiler, { log: () => {} }));

app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
