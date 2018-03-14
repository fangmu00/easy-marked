const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const { resolve } = path;

module.exports = {
  context: resolve(__dirname, './'),
  entry: {
    demo: './demo/index.jsx',
    index: './src/index.js',
  },
  output: {
    libraryTarget: 'umd',
    path: path.join(__dirname, './dist/'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'less-loader',
          }],
        }),
      }],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    mainFields: ['main'],
  },
  externals: {
    react: 'var React',
    'react-dom': 'var ReactDOM',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new ExtractTextPlugin('styles.css'),
  ],
};
