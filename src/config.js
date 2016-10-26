// check if we already added polyfill otherwise tests fail.
const theGlobal = (typeof global === "object" ? global : typeof window === "object" ? window : {});

if (!theGlobal._babelPolyfill) {
  require('babel-polyfill');
}

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiRoot: process.env.APIROOT || '//mlab-api-dot-mlab-oti.appspot.com',

  // How many API calls the client caches in the LRU cache
  apiCacheLimit: 25,

  app: {
    title: 'MLab Vis',
    description: 'Measurement Lab Visualizations - Analyzing internet speeds worldwide.',
    head: {
      titleTemplate: '%s - MLab Vis',
      meta: [
        {
          name: 'description',
          content: 'Measurement Lab Visualizations - Analyzing internet speeds worldwide.',
        },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'MLab Vis' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'MLab Vis' },
        {
          property: 'og:description',
          content: 'Measurement Lab Visualizations - Analyzing internet speeds worldwide.',
        },
      ],
    },
  },

}, environment);
