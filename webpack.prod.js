const path = require("path");
const common = require("./webpack.config");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge.merge( common, {
    mode: "production",
    output: {
        filename: "main.[hash].js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new MiniCssExtractPlugin({filename: "[name].[hash].css"})
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                  MiniCssExtractPlugin.loader, // extract styles to file
                  "css-loader", // turns css to js
                  "sass-loader", // turns sass to css
                ],
              },
        ]
    },
});