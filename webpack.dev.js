// webpack.dev.js
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./",
    watchContentBase: true,
    open: "chrome", // use "chrome" for PC
  },
});