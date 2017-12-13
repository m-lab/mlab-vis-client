#!/usr/bin/env node
require('../server.babel'); // babel registration (runtime transpilation for node)
var path = require('path');
var rootDir = path.resolve(__dirname, '..');
/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DISABLE_SSR__ = false;

console.log(JSON.stringify(process.env));

if (__DEVELOPMENT__) {
  // If you change this value, also change the value in wepback dev config (dev.config.js)
  global.__DISABLE_SSR__ = true;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING

  var pipingIgnoreTest;

  // if not server-side rendering, do not restart when we edit JS unless it is the server
  if (__DISABLE_SSR__) {
    pipingIgnoreTest = /(\/\.|~$|\.json$|\.scss$|src\/api|src\/components\/|src\/containers|src\/redux|src\/theme|src\/client|src\/routes|src\/url|src\/utils|src\/hoc)/i;

  // server-side rendering, so have to restart after all JS changes
  } else {
    pipingIgnoreTest = /(\/\.|~$|\.json$|\.scss$)/i;
  }


  if (!require('piping')({
      hook: true,
      ignore: pipingIgnoreTest,
    })) {
    return;
  }
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'))
  .development(__DEVELOPMENT__)
  .server(rootDir, function () {
    require('../src/server/server');
  });
