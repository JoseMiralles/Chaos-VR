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
    openPage: 'http://localhost:8080',
    host: '0.0.0.0', // host on local network (Use PC's ip, "ipconfig" in cmd)
  },
});