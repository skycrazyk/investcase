import webpack from 'webpack';
import commonConfig from './common';

const developConfig: webpack.Configuration = ((config: typeof commonConfig) => {
  // mode
  config.mode = 'development';

  // source map
  config.devtool = 'eval-source-map';

  // dev server
  config.devServer = {
    hot: true,
  };

  return config;
})(commonConfig);

export default developConfig;
