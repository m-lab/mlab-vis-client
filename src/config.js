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
  apiRoot: process.env.APIROOT || '//data-api.measurementlab.net/',

  // How many API calls the client caches in the LRU cache
  apiCacheLimit: 100,
  searchCacheLimit: 50, // just those used for search

  app: {
    title: 'MLab Vis',
    description: 'Measurement Lab Visualizations - Analyzing internet speeds worldwide.',
    head: {
      titleTemplate: '%s - M-Lab Viz',
      meta: [
        {
          name: 'description',
          content: 'Measurement Lab Visualizations - Analyzing internet speeds worldwide.',
        },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'M-Lab Viz' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'M-Lab Viz' },
        {
          property: 'og:description',
          content: 'Measurement Lab Visualizations - Analyzing internet speeds worldwide.',
        },
        { property: 'og:image', content: 'https://na-production.s3.amazonaws.com/images/mlab_bocoup.min-650x200.jpg' },
        { property: 'og:image:type', content: 'image/jpg' },
        { property: 'og:image:width', content: '650' },
        { property: 'og:image:height', content: '200' },
      ],
    },
  },

}, environment);
