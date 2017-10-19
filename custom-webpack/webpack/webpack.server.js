const { root } = require('./helpers');

const { AotPlugin } = require('@ngtools/webpack');
const nodeExternals = require('webpack-node-externals');

/**
 * This is a server config which should be merged on top of common config
 * CHF 10/18/2017 be sure to whitelist any 3rd party libs i.e. angular-esri-loader
 */
module.exports = {
  externals: [
    nodeExternals({
      whitelist: [/@angular/, /@ng/, /angular-esri-loader/]
    })
  ],
  entry: root('./src/main.server.ts'),
  output: {
    filename: 'server.js'
  },
  target: 'node'
};
