
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');


const OUTPUT_DIR = __dirname + '/dist';

const {ifProduction, ifNotProduction} = getIfUtils(process.env.NODE_ENV || 'development');


module.exports = {
  context: __dirname + '/src',
  entry: {
    main: './index.js',
    vendor: './vendor.js'
  },
  devtool: ifProduction(
    'source-map',
    'cheap-module-eval-source-map'
  ),
  devServer: {
    contentBase: OUTPUT_DIR,
    hot: true
  },
  module: {
    rules: removeEmpty([
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      ifNotProduction({
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }),
      ifProduction({
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }),
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: ifProduction(
              '[name].[hash].[ext]',
              '[name].[ext]'
            )
          }
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: ifProduction(
              '[name].[hash].[ext]',
              '[name].[ext]'
            )
          }
        }
      }
    ])
  },
  plugins: removeEmpty([
    ifProduction(new CleanWebpackPlugin([
      OUTPUT_DIR
    ])),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    ifNotProduction(new webpack.HotModuleReplacementPlugin()),
    new ExtractTextPlugin(ifProduction(
      '[name].[chunkhash].css',
      '[name].css'
    )),
    ifProduction(new UglifyJSPlugin())
  ]),
  output: {
    filename: ifProduction(
      '[name].[chunkhash].js',
      '[name].js'
    ),
    path: OUTPUT_DIR
  }
};
