module.exports = [
  {
    entry: './src/main.ts',
    output: {
      filename: './app/main.js'
    },
    devtool: 'inline-source-map',
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
    entry: './src/renderer.ts',
    output: {
      filename: './app/renderer.js'
    },
    devtool: 'inline-source-map',
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
