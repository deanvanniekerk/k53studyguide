const webpack = require("webpack");
const merge = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    output: {
        filename: "dist/[name].[contenthash].js",
    },

    plugins: [new webpack.HashedModuleIdsPlugin()],

    optimization: {
        minimizer: [new TerserPlugin()],
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    },
});
