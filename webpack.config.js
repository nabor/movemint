var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './src/app/Start.tsx'
  ],
  output: {
    path: './public',
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx']
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.tsx?$/, loader: 'ts' },
      { test: /\.scss$/, loader: 'style!css!sass' }
    ],
    postLoaders: [
      {
        include: path.resolve(__dirname, 'node_modules/pixi.js/src'),
        loader: 'transform/cacheable?brfs'
      }
    ]
  },
  target: 'electron',
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/launcher' },
      { from: 'src/static/index.html' },
      { from: 'src/static/assets', to: 'assets' }
    ])
  ]
}
