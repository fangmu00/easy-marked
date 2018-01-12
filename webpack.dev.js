const webpack = require('webpack');
const path = require('path');

const { resolve } = path;

module.exports = {
  context: resolve(__dirname, './'),
  entry: {
    demo: './demo/index.jsx',
    index: './index.js',
  },
  output: {
    path: path.join(__dirname, './dist/'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'less-loader',
        }],
      }],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  devServer: {
    contentBase: resolve(__dirname, './'),
    // 输出文件的路径
    publicPath: '/dist/',
    // 和上文 output 的“publicPath”值保持一致
  },
  externals: {
    react: 'var React',
    'react-dom': 'var ReactDOM',
  },
  devtool: 'inline-source-map',
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: './index.html',
  //   }),
  // ],
};
