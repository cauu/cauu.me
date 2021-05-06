const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const paths = require('./paths');

module.exports = merge(common, {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map',
  // resolve monorepo
  resolve: {
    mainFields: ['module', 'main'],
  },
  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    contentBase: paths.build,
    open: true,
    compress: true,
    hot: true,
    port: 8080,
    proxy: {
      '/wukong/**': {
        changeOrigin: true,
        target: 'http://mtv.cap.test.sankuai.com',
        onProxyReq(proxyReq, req, res) {
          const cookie = proxyReq.getHeader('cookie');
          proxyReq.setHeader('cookie', `${cookie}; cap_login_type=SSO`);
        },
      },
    },
  },

  module: {
    rules: [
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(scss)$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true, modules: true, esModule: false } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.(less|css)$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true, esModule: false } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'less-loader',
            options: {
              implementation: require('less'),
              sourceMap: true,
              lessOptions: {
                javascriptEnabled: true,
                strictMath: false,
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
  ],
});
