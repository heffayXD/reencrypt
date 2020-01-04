const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './app/main.dev.js',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: path.join(__dirname, 'app'),
    publicPath: '/',
    filename: 'main.prod.js'
  },
  target: 'electron-main',
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  }
}
