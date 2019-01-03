const merge = require('webpack-merge');
const MiniExtractCssPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common');

const smartMerge = merge.smartStrategy({
  entry: 'prepend',
  'module.rules.use': 'prepend'
});

module.exports = smartMerge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    new MiniExtractCssPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css'
    })
  ],
  output: {
    filename: '[name].[contenthash:8].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniExtractCssPlugin.loader]
      }
    ]
  }
});
