const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals")

module.exports = {
  mode: process.env.NODE_ENV || "development",
  target: "node",
  node: {
    __dirname: true
  },
  externals: [nodeExternals()],
  entry: {
    build: "./app.ts",
  },
  output: {
    path: __dirname + "/bin",
    filename: "[name].js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader"
      }
    ]
  }
};
