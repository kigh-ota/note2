module.exports = [
  {
    entry: './src/main.ts',
    output: {
      filename: './app/main.js'
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
        }
      ]
    },
    target: 'electron'
  },
  {
    entry: './src/renderer.js',
    output: {
      filename: './app/renderer.js'
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
        }
      ]
    },
    target: 'electron'
  }
];
