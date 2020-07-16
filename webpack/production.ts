import webpack from 'webpack';
import commonConfig from './common';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const productionConfig: webpack.Configuration = ((
  config: typeof commonConfig
) => {
  // mode
  config.mode = 'production';

  // resolve plugins
  config.plugins = config.plugins || [];

  // CSS extract and minification
  config.plugins.push(new MiniCssExtractPlugin());
  (config.module?.rules[0].use as webpack.RuleSetUseItem[]).splice(
    0,
    1,
    MiniCssExtractPlugin.loader
  );

  return config;
})(commonConfig);

export default productionConfig;
