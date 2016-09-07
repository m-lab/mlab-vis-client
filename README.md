# MLab Visualizations

This project contains the web client for Measurement Lab visualizations.


## Installation

```bash
npm install
```

## Development Server

```bash
npm run dev
```

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
```

## Deploying 

The site is currently configured to deploy to http://client-dot-mlab-oti.appspot.com/. To do so, run:

```bash
npm run deploy
```

---

*Originally built from https://github.com/erikras/react-redux-universal-hot-example*

