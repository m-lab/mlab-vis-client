# M-Lab Visualizations

[![Build Status](https://travis-ci.org/m-lab/mlab-vis-client.svg?branch=master)](https://travis-ci.org/m-lab/mlab-vis-client)

This project contains the repository for the Measurement Lab visualizations web client - [https://viz.measurementlab.net](https://viz.measurementlab.net)

_mlab-vis-client_ is a NodeJS application using ReactJS.

## General Development Practices

M-Lab follows this general development practice:

  * [Fork](https://github.com/m-lab/mlab-vis-client#fork-destination-box) the mlab-vis-client repository.
  * Develop in your fork's master or feature branches
  * Test and preview changes by deploying to the _staging_ GAE service
  * [Open a new pull request](https://github.com/m-lab/mlab-vis-client/compare) to merge changes from your fork to [upstream master](https://github.com/m-lab/mlab-vis-client), and request or assign one or more reviewers to perform a code review
  * Make changes recommended in the code review
  * Merge and deploy the upstream master branch to the _production_ GAE service

## Development Environment Setup

  * Fork this repo, then clone to your local machine
  * Add a git remote for upstream
  * Initialize submodules by running `git submodule init` and `git submodule update`
  * Install [NodeJS](https://nodejs.org/en/)
  * Enter the directory where you've cloned your fork of _mlab-vis-client_ and install dependenciesi: `$ npm install`

### Development Server

We are using webpack's DllPlugin, so **we need to build our DLL vendor package before running our standard webpack watch**. To do so, run this once:

```bash
npm run webpack-dll
```

This puts all the vendor files in their own bundle so we don't need to scan them when rebuilding our files during development.

If you see the error below, you need to run `npm run webpack-dll`.
```
Error: Cannot find module '.../mlab-vis-client/static/dist/vendor-manifest.json'
```

Now to start the dev server, there are two options:

  * Web Server + Webpack Watch in one command: `$ npm run dev`
  * Web Server separate from Webpack Watch
    * Start the web server: `$ npm run start-dev`
    * Start webpack watch: `$ npm run webpack-watch`

If you are running against a local API server, you can overwrite the URL that
will be used for the api server as part of your run command like so:
`$ APIROOT=//localhost:8080/ npm run dev`.
Note that the `//` and final `/` are required.

### Caching with HardSourceWebpackPlugin

We are using [HardSourceWebpackPlugin](https://github.com/mzgoddard/hard-source-webpack-plugin). If your webpack build is operating strangely, be sure to run:

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

  * In one terminal, run webpack with: `$ npm run webpack-dashboard`
  * And in another, run the web server with: `$ npm run start-dev`

Note that the dashboard adds roughly 500ms to the webpack rebuild time.

### Testing

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## Deploying to Staging and Production GAE Services

M-Lab maintains separate GCP projects for hosting _staging_ and _production_ instances of the mlab-vis-client application.

  * [_staging_](https://console.cloud.google.com/appengine/services?project=mlab-staging) provides the GAE service, [viz](https://viz-dot-mlab-staging.appspot.com/)
  * [_production_](https://console.cloud.google.com/appengine/services?project=mlab-oti) provides the GAE service, [viz](https://viz.measurementlab.net/)

Deploying to either staging or production requires the [Google Cloud SDK](https://cloud.google.com/sdk/) to be installed on your development system, and your preferred Google account must be given rights to push to both projects.

### Deploying Code to GAE

To deploy the site to GAE, call:

```bash
$ KEY_FILE=<your service key> ./deploy.sh -m sandbox|staging|production
```

The mlab-vis-client application is configured to deploy to the _viz_ GAE service in the selected project.

