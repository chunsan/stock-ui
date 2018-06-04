const webpack = require('webpack');

module.exports = (webpackConfig) => {
  webpackConfig.output.chunkFilename = '[name].[hash].js';// http://webpack.github.io/docs/configuration.html#output-chunkfilename
  webpackConfig.resolve.alias = {
    wsgcomponents: `${__dirname}/src/wsgcomponents`,
    components: `${__dirname}/src/components`,
    services: `${__dirname}/src/services`,
    utils: `${__dirname}/src/utils`
  };

  webpackConfig.devtool = '#eval'
  return webpackConfig;
};
