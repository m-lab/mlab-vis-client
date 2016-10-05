import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object,
  };

  renderScripts() {
    const { assets } = this.props;
    if (__DEVELOPMENT__) {
      // in dev we separate vendor out for faster webpack rebuild times.
      return [
        <script key="vendor" src={assets.javascript.vendor} charSet="UTF-8" />,
        // TODO: we can switch to mapbox if we want.
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0-beta.2/leaflet.js" charSet="UTF-8" />,
        <script src="https://mapzen.com/tangram/0.6/tangram.min.js" charSet="UTF-8" />,
        <script key="main" src="http://localhost:3001/dist/main.js" charSet="UTF-8" />,
      ];
    }

    return [
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0-beta.2/leaflet.js" charSet="UTF-8" />,
      <script src="https://mapzen.com/tangram/0.6/tangram.min.js" charSet="UTF-8" />,
      <script src={assets.javascript.main} charSet="UTF-8" />,
    ];
  }

  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();

    // For development, include base css to limit the amount of style change on load.
    // This is not an issue for production builds since CSS is linked.
    let devStyle;
    if (!Object.keys(assets.styles).length) {
      const baseStyle = assets.assets['./src/assets/base.scss']._style; // eslint-disable-line
      devStyle = (
        <style data-info="dev-preload-styles" dangerouslySetInnerHTML={{ __html: baseStyle }} />
      );
    }

    return (
      <html lang="en-US">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          <link href="https://fonts.googleapis.com/css?family=Roboto:300,500" rel="stylesheet" />

          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, key) =>
            <link
              href={assets.styles[style]}
              key={key}
              media="screen, projection"
              rel="stylesheet"
              type="text/css"
              charSet="UTF-8"
            />
          )}
         {devStyle}
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{ __html: content }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }}
            charSet="UTF-8"
          />
          {this.renderScripts()}
        </body>
      </html>
    );
  }
}
