// webpack.config.js
const path = require("path");
// путь к источнику
const pathSrc = path.resolve(__dirname, "./app/");
// путь к папке билда
const pathDest = path.resolve(__dirname, "./app-bundle/");

// Очищает выходной каталог при каждом запуске сборщика webPack
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// Сжатие JS
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  stats: "minimal",
  target: "node",
  mode: "production",
  entry: {
    server: `${pathSrc}/server.js`,
  },
  output: {
    path: pathDest,
    filename: "[name].min.js",
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  devtool: "inline-source-map",
};
