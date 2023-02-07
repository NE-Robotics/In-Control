import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import json from "@rollup/plugin-json";

const bundle = (input, output, external = []) => ({
  input: "src/" + input,
  output: {
    file: "bundles/" + output,
    format: "cjs"
  },
  plugins: [typescript(), nodeResolve(), commonjs(), cleanup(), json()],
  external: external
});

const mainBundles = [
  bundle("main/main.ts", "main.js", ["electron", "electron-fetch", "fs", "jsonfile", "net", "os", "path", "ssh2"]),
  bundle("main/preload.ts", "preload.js", ["electron"])
];
const largeRendererBundles = [bundle("hub/hub.ts", "hub.js"), bundle("main/satellite.ts", "satellite.js")];
const smallRendererBundles = [
  bundle("main/editRange.ts", "editRange.js"),
  bundle("main/unitConversion.ts", "unitConversion.js"),
  bundle("main/renameTab.ts", "renameTab.js"),
  bundle("main/export.ts", "export.js"),
  bundle("main/download.ts", "download.js"),
  bundle("main/preferences.ts", "preferences.js")
];
const workerBundles = [
  bundle("hub/data_sources/rlogWorker.ts", "hub$rlogWorker.js"),
  bundle("hub/data_sources/wpilogWorker.ts", "hub$wpilogWorker.js"),
  bundle("hub/data_sources/dsLogWorker.ts", "hub$dsLogWorker.js"),
  bundle("hub/exportWorker.ts", "hub$exportWorker.js")
];

export default (cliArgs) => {
  if (cliArgs.configMain === true) return mainBundles;
  if (cliArgs.configLargeRenderers === true) return largeRendererBundles;
  if (cliArgs.configSmallRenderers === true) return smallRendererBundles;
  if (cliArgs.configWorkers === true) return workerBundles;
  return [...mainBundles, ...largeRendererBundles, ...smallRendererBundles, ...workerBundles];
};
