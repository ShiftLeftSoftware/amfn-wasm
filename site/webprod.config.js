const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js"
  },
  plugins: [
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, ".")
    }),
  ],
  mode: "production"
};