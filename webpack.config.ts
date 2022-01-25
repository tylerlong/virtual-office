/* eslint-disable node/no-unpublished-import */
import {Configuration} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const config: Configuration = {
  devtool: 'source-map',
  mode: 'development',
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: path.join(__dirname, 'docs'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jpeg$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Virtual Office',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};

export default config;
