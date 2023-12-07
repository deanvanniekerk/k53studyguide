const { merge } = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",

    devtool: "eval-source-map",

    output: {
        filename: "dist/bundle.js",
    },

    devServer: {
        port: 3000,
        static: "./dist",
        hot: true,
        historyApiFallback: true,
    },

    plugins: [new webpack.HotModuleReplacementPlugin()],
});
