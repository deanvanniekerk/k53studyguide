const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const config = require("config");

const environment = config.get("environment");
const azureStorageTableUrl = config.get("azureStorageTableUrl");
const azureStorageTableSasToken = config.get("azureStorageTableSasToken");
const logLevel = config.get("logLevel");

module.exports = {
    entry: {
        app: path.resolve(__dirname, "src/index.tsx"),
    },

    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/",
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src/"),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["build/dist"],
        }),
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
            filename: "index.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "public/assets/"),
                    to: path.resolve(__dirname, "build/assets"),
                },
            ],
        }),
        new webpack.DefinePlugin({
            __ENVIRONMENT__: JSON.stringify(environment),
            __AZURE_STORAGE_TABLE_URL__: JSON.stringify(azureStorageTableUrl),
            __AZURE_STORAGE_TABLE_SAS_TOKEN__: JSON.stringify(azureStorageTableSasToken),
            __LOG_LEVEL__: JSON.stringify(logLevel),
        }),
    ],
};
