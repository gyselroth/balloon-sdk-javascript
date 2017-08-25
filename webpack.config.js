const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = [
  {
    target: 'web',
    entry: './src/lib/balloon-client.js',

    output: {
      library: 'Balloon',
      libraryTarget: 'umd',
      filename: 'balloon.js',
      path: path.resolve(__dirname),
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
            },
          },
        },
      ],
    },
  },
  {
    target: 'web',
    entry: './src/lib/balloon-client.js',

    output: {
      library: 'Balloon',
      libraryTarget: 'umd',
      filename: 'balloon.min.js',
      path: path.resolve(__dirname),
    },

    plugins: [new UglifyJSPlugin()],

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
            },
          },
        },
      ],
    },
  },
];
