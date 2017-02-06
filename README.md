# MLab Visualizations

[![Build Status](https://travis-ci.org/bocoup/mlab-vis-client.svg?branch=master)](https://travis-ci.org/bocoup/mlab-vis-client)

This project contains the web client for Measurement Lab visualizations.


## Installation

```bash
npm install
```

## Development Server

We are using webpack's DllPlugin, so **we need to build our DLL vendor package before running our standard webpack watch**. To do so, run this once:

```bash
npm run webpack-dll
```


This puts all the vendor files in their own bundle so we don't need to scan them when rebuilding our files during development.


If you see this error:
```
Error: Cannot find module '.../mlab-vis-client/static/dist/vendor-manifest.json'
```

You need to run `npm run webpack-dll`.


Now to start the dev server, there are two options:

### Web Server + Webpack Watch in one command

```bash
npm run dev
```

### Web Server separate from Webpack Watch

Start the web server:

```bash
npm run start-dev
```

Start webpack watch:

```bash
npm run webpack-watch
```

### Caching with HardSourceWebpackPlugin

We are using [HardSourceWebpackPlugin](https://github.com/mzgoddard/hard-source-webpack-plugin). If your webpack build is operating strangely, be sure to run a

```bash
npm run webpack-clean-cache
```

This plugin dramatically speeds up build times, but does require you to clean the cache occasionally (when problems arise).

If you see an error in your console similar to:

```
Uncaught TypeError: __webpack_require__(...) is not a function
```

Chances are you need to clean the cache. Run the command as described above.

### Using webpack-dashboard

If you prefer to have webpack rendered in a dashboard, use two separate terminal windows.
In one, run webpack with:

```bash
npm run webpack-dashboard
```

And in the other, run the web server with:

```bash
npm run start-dev
```

Note that the dashboard adds roughly 500ms to the webpack rebuild time.

## Testing

```bash
npm test
```

## Building for Production

```bash
npm run build
```

## Production Server

```bash
npm run start
gcloud app deploy dispatch.yaml
```

## Deploying

The site is currently configured to deploy to http://viz.measurementlab.net. To do so, run:

```bash
npm run deploy
```

---

*Originally built from https://github.com/erikras/react-redux-universal-hot-example*
