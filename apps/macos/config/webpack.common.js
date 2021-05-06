const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const DotenvPlugin = require('dotenv-webpack');
const paths = require('./paths');

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [`${paths.src}/index.tsx`],

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.vue'],
    alias: {
      '@': paths.src,
    },
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: require.resolve('crypto-browserify'),
      'crypto-browserify': require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
    },
  },

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  externals: {
    'vue-router': 'VueRouter',
    vue: 'Vue',
  },
  // Customize the webpack build process
  plugins: [
    new DotenvPlugin(),

    new VueLoaderPlugin(),
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      // favicon: `${paths.public}/favicon.ico`,
      template: `${paths.public}/index.html`, // template file
      filename: 'index.html', // output file
      inject: true,
    }),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      {
        test: /\.(js|mjs|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          rootMode: 'upward',
        },
      }, {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          },
        },
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            appendTsxSuffixTo: ['\\.vue$'],
            // https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse
            // happyPackMode: useThreads
          },
        }],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          },
        },
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            appendTsSuffixTo: ['\\.vue$'],
            // https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse
            // happyPackMode: useThreads
          },
        }],
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      // { test: /\.js$/, use: ['babel-loader'] },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },
};
