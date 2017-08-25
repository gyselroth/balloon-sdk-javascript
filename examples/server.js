const path = require('path');

/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
/* eslint-enable import/no-extraneous-dependencies */

const webpackConfig = require('../webpack.config.js')[0];


const app = express();
const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3300;

app.use(webpackDevMiddleware(webpack(webpackConfig), {
  publicPath: '/__build__/',
}));

app.use(express.static(path.join(__dirname, 'browser')));

app.listen(port, hostname);

// eslint-disable-next-line no-console
console.log(`Development server listening on http://${hostname}:${port}`);
