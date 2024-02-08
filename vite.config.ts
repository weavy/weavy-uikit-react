import "dotenv/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "./package.json" assert { type: "json" };
import { resolve } from "path";
import dts from 'vite-plugin-dts'
import { getBabelOutputPlugin } from "@rollup/plugin-babel";

const sourceName =
  process.argv.find((s) => s.startsWith("--source-name="))?.split("=")[1] ||
  packageJson.name;
const version =
  process.argv.find((s) => s.startsWith("--version="))?.split("=")[1] ||
  packageJson.version;

console.log(sourceName, version);

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    react(), 
    dts({
      outDir: "dist/types",
      include: ['lib'] 
    })
  ],
  define: {
    WEAVY_SOURCE_NAME: JSON.stringify(sourceName),
    WEAVY_VERSION: JSON.stringify(version),
    WEAVY_URL: JSON.stringify(process.env.WEAVY_URL),
    WEAVY_TOKEN_URL: JSON.stringify(process.env.WEAVY_TOKEN_URL),
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "lib/index.ts"),
      name: "WeavyLib",
      // the proper extensions will be added
      fileName: "weavy",
    },
    sourcemap: false,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom"],
      output: [
        {
          format: "esm",
        },
        {
          format: "umd",
          name: "WeavyLib",
          globals: {
            "react": "React",
            "react-dom": "ReactDOM"
          }
        },
        {
          format: "esm",
          name: "WeavyLib",
          entryFileNames: "weavy.es5.umd.cjs",
          plugins: [
            getBabelOutputPlugin({
              presets: [['@babel/preset-env', { modules: "umd" }], "@babel/preset-react"],
              minified: true,
              comments: false,
            }),
          ],
          globals: {
            "react": "React",
            "react-dom": "ReactDOM"
          }
        },
        {
          format: "es",
          entryFileNames: "weavy.es5.esm.js",
          plugins: [
            getBabelOutputPlugin({
              presets: [['@babel/preset-env', { modules: "auto" }], "@babel/preset-react"],
              minified: true,
              comments: false,
            }),
          ],
        },
      ],
    },
  },
});
