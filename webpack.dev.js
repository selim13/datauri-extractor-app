const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const LocaltunnelPlugin = require('localtunnel-webpack-plugin');
const common = require('./webpack.common');

const smartMerge = merge.smartStrategy({
  entry: 'prepend',
  'module.rules.use': 'prepend'
});

module.exports = smartMerge(common, {
  mode: 'development',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new LocaltunnelPlugin({ localtunnel: { subdomain: 'dataurl-extractor' } })
  ],
  output: {
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    watchContentBase: true,
    host: '0.0.0.0',
    hot: true,
    public: 'dataurl-extractor.localtunnel.me'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader']
      }
    ]
  }
});
