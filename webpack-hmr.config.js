// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require("webpack-node-externals");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ["webpack/hot/poll?100", options.entry], // Poll ogni 100ms per vedere se ci sono cambiamenti
    externals: [
      nodeExternals({
        allowlist: ["webpack/hot/poll?100"], // Permetti HMR anche con nodemodules
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(), // Abilita HMR
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/], // Evita di triggerare HMR su file compilati
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        autoRestart: false, // No restart manuale
      }),
    ],
  };
};