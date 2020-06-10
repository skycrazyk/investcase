import path from 'path';
import webpack from 'webpack';
import tsconfigPathsWebpackPlugin from 'tsconfig-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const config: webpack.Configuration = {
  mode: 'development',
  entry: ['react-hot-loader/patch', './src/index.tsx'],
  output: {
    path: path.resolve(__dirname, '../dist/'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: { auto: true },
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 versions' } },
              ],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
            plugins: [
              'react-hot-loader/babel',
              ['import', { libraryName: 'antd', style: 'css' }, 'antd'],
              ['import', { libraryName: 'lodash' }, 'lodash'],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    plugins: [
      new tsconfigPathsWebpackPlugin({
        configFile: path.resolve(__dirname, './tsconfig.json'),
      }),
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'secret',
      template: './src/index.ejs',
    }),
  ],
};

export default config;
