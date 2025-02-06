import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "../package.json";
import { resolve } from "node:path";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import preserveDirectives from "rollup-preserve-directives";
import { utf8BomPlugin } from "@weavy/uikit-web/utils/vite-plugins.js";

const sourceName =
  process.argv.find((s) => s.startsWith("--source-name="))?.split("=")[1] ||
  packageJson.name;
const version =
  process.argv.find((s) => s.startsWith("--version="))?.split("=")[1] ||
  packageJson.version;

console.log(sourceName, version);

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const define = {
    WEAVY_SOURCE_NAME: JSON.stringify(sourceName),
    WEAVY_VERSION: JSON.stringify(version),
    //WEAVY_URL: JSON.stringify(env.WEAVY_URL),
    //WEAVY_TOKEN_URL: JSON.stringify(env.WEAVY_TOKEN_URL),
    "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
  };

  return {
    plugins: [react({ jsxRuntime: "classic" })],
    define,
    resolve: {
      alias: [
        {
          find: "@weavy/uikit-web",
          replacement: "@weavy/uikit-web/dist/build/weavy.esm.bundle.js",
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or "modern"
        },
      },
    },
    build: {
      emptyOutDir: false,
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, "../lib/index.ts"),
        name: "WeavyLib",
        // the proper extensions will be added
        fileName: "weavy",
      },
      sourcemap: false,
      rollupOptions: {
        plugins: [utf8BomPlugin(), preserveDirectives()],
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["react", "react-dom"],
        output: [
          {
            format: "cjs",
            entryFileNames: "weavy.bundle.js",
            dynamicImportInCjs: false,
            minifyInternalExports: false,
            inlineDynamicImports: true,
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
          },
          {
            format: "umd",
            name: "WeavyLib",
            dynamicImportInCjs: false,
            minifyInternalExports: false,
            //interop: "esModule",
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
          },
          {
            format: "esm",
            entryFileNames: "weavy.es5.esm.js",
            minifyInternalExports: false,
            inlineDynamicImports: true,
            plugins: [
              getBabelOutputPlugin({
                presets: [
                  ["@babel/preset-env", { modules: "auto" }],
                  "@babel/preset-react",
                ],
                minified: true,
                comments: false,
              }),
            ],
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
          },
          {
            format: "esm",
            name: "WeavyLib",
            entryFileNames: "weavy.es5.umd.cjs",
            minifyInternalExports: false,
            inlineDynamicImports: true,
            plugins: [
              getBabelOutputPlugin({
                presets: [
                  ["@babel/preset-env", { modules: "umd" }],
                  "@babel/preset-react",
                ],
                minified: true,
                comments: false,
              }),
            ],
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
          },
        ],
      },
    },
  };
});
