import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";

//import packageJson from `./package.json` assert { type: `json` };

//const packageJson = require("./package.json");
const { default: packageJson } = await import("./package.json", {
  assert: {
    type: "json",
  },
});

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        plugins: [
          getBabelOutputPlugin({
            presets: ["@babel/preset-env", "@babel/preset-react"],
            minified: true,
            comments: false,
          }),
        ],
      },
      {
        file: packageJson.exports["."].require,
        format: "cjs",
        sourcemap: true,
        plugins: [terser()],
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
        plugins: [
          getBabelOutputPlugin({
            presets: ["@babel/preset-env", "@babel/preset-react"],
            minified: true,
            comments: false,
          }),
        ],
      },
      {
        file: packageJson.exports["."].import,
        format: "esm",
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
    external: ["react", "react-dom"],
    strictDeprecations: false,
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    strictDeprecations: false,
  },
];
