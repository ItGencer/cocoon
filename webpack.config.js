const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/index.js",

    output: {
      path: path.resolve(__dirname, "public"),
      filename: isProduction ? "bundle.[contenthash].js" : "bundle.js",
      clean: true,
      assetModuleFilename: "assets/[name].[hash][ext]",
    },

    module: {
      rules: [
        {
          test: /\.(scss|sass)$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.(jpg|jpeg|png|svg|webp|gif)$/i,
          type: "asset/resource",
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? "styles.[contenthash].css" : "styles.css",
      }),
    ],

    optimization: {
      minimize: isProduction,
    },

    devServer: {
      static: "./public",
      port: 3000,
      open: true,
      hot: true,
    },
  };
};