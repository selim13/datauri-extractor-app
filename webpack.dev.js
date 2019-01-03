const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');

const smartMerge = merge.smartStrategy({
  entry: 'prepend',
  'module.rules.use': 'prepend'
});

module.exports = smartMerge(common, {
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    watchContentBase: true,
    host: '0.0.0.0',
    hot: true
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
