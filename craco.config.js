const Dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');

// Determine the environment to load
const ENV = process.env.DEPLOY_ENV || 'dev';
const result = Dotenv.config({ path: `./.env.${ENV}` });

if (result.error) {
  throw result.error;
}

const env = Dotenv.config({ path: `./.env.${ENV}` }).parsed || {};
const envLocal = Dotenv.config({ path: './.env.local' }).parsed || {};

// Collect all .env keys and values
const envKeys = Object.keys(env).reduce((prev, next) => {
  // Precedence for .env.local
  prev[`process.env.${next.trim()}`] = (envLocal[next]) ? JSON.stringify(envLocal[next].trim()) : JSON.stringify(env[next].trim());
  return prev;
}, {});

// Check things out
console.log(`
  key: ${ENV.toUpperCase()},
  value: ${process.env.REACT_APP_DEPLOY_ENV},
  accumulator: ${JSON.stringify(envKeys, null, 2)}
`);

module.exports = {
  webpack: {
    plugins: [
      new webpack.DefinePlugin(envKeys),
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 3001,
    historyApiFallback: true,
    open: true,
  }
};
