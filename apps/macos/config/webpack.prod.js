const { merge } = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./webpack.common.js');
const paths = require('./paths');

const { PUBLIC_URL } = process.env;

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    path: paths.build,
    publicPath: PUBLIC_URL ? `${PUBLIC_URL}/mtv-demo` : './',
    filename: 'js/[name].[contenthash].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  sourceMap: false,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                  },
                },
              },
              'postcss-loader',
              'sass-loader'],
          },
          {
            test: /\.module\.\w+$/,
            use: [MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  sourceMap: false,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                  },
                },
              },
              'postcss-loader',
              'sass-loader'],
          },
          {
            use: [MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  sourceMap: false,
                  modules: false,
                },
              },
              'postcss-loader',
              'sass-loader'],
          },
        ],
      },
      {
        test: /\.(less|css)$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  sourceMap: false,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                  },
                },
              },
              'postcss-loader',
              {
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                    strictMath: false,
                  },
                },
              }],
          },
          {
            test: /\.module\.\w+$/,
            use: [MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  sourceMap: false,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                  },
                },
              },
              'postcss-loader',
              {
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                    strictMath: false,
                  },
                },
              }],
          },
          {
            use: [MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  sourceMap: false,
                  modules: false,
                },
              },
              'postcss-loader',
              {
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                    strictMath: false,
                  },
                },
              }],
          },
        ],
      },
    ],
  },
  plugins: [
    // Extracts CSS into separate files
    // Note: style-loader is for development, MiniCssExtractPlugin is for production
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), '...'],
    // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
    // instead of having their own. This also helps with long-term caching, since the chunks will only
    // change when actual code changes, not the webpack runtime.
    runtimeChunk: {
      name: 'runtime',
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
