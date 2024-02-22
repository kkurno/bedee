/* eslint-disable @typescript-eslint/no-var-requires */
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = function (options) {
  return {
    ...options,
    devtool: 'source-map',
    plugins: [
      ...options.plugins,
      new ESLintPlugin({
        extensions: ['.ts', '.js'],
      }),
    ],
  };
};
