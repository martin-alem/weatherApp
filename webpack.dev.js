const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");

module.exports = merge.merge( common, {
    mode: "development",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                  "style-loader", //inject style to dom
                  "css-loader", // turns css to js
                  "sass-loader", // turns sass to css
                ],
              },
        ]
    }
});