var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var APP_PATH = path.resolve(ROOT_PATH, 'src');
module.exports= {
  entry: {
    app: path.resolve(APP_PATH, 'app.jsx')
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        enforce: 'pre',
        loader: 'eslint-loader',
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    modules: ["node_modules", path.join(__dirname, "src")],
    extensions: ['.js', '.jsx']
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: true,
    inline: true,
  },


  plugins: [
  new HtmlwebpackPlugin({
    title: 'My first react app'
  })
  ]
}
