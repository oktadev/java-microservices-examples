'use strict';
const webpackMerge = require('webpack-merge').merge;
const prodEnv = require('./prod.env');

module.exports = webpackMerge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_API_URL: "''",
  BUILD_TIMESTAMP: `'${new Date().getTime()}'`,
  // APP_VERSION is passed as an environment variable from the Gradle / Maven build tasks.
  VERSION: `'${process.env.hasOwnProperty('APP_VERSION') ? process.env.APP_VERSION : 'UNKNOWN'}'`,
});
