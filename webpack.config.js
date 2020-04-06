const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {

  entry: ['./src/index.js', './src/style.scss'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    port: 4200,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: './style.css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        loader: 'file-loader',
        options: { outputPath: 'fonts' },
      },
      {
        test: /\.jpg|jpeg|png$/i,
        loader: 'file-loader',
        options: { outputPath: 'img' },
      },
    ],
  },
};
