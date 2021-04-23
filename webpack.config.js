const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const clean = require("clean-webpack-plugin")

module.exports = {
    entry: "./src/js/app.js",
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-object-rest-spread','@babel/plugin-proposal-class-properties']
              }
            }
          }
        ],
      },

      plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new clean.CleanWebpackPlugin()
      ]
}