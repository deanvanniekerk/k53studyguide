const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",

    output: {
        filename: "dist/[name].[contenthash].js",
    },

    optimization: {
        moduleIds: "deterministic",
        minimizer: [new TerserPlugin(), new CssMinimizerPlugin({})],
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    },
});
