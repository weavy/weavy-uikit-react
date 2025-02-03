import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "../package.json";
import fs from "node:fs";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import preserveDirectives from "rollup-preserve-directives";
import { utf8BomPlugin, weavyAuthServer } from "@weavy/uikit-web/utils/vite-plugins.js"

const sourceName =
  process.argv.find((s) => s.startsWith("--source-name="))?.split("=")[1] ||
  packageJson.name;
const version =
  process.argv.find((s) => s.startsWith("--version="))?.split("=")[1] ||
  packageJson.version;

console.log(sourceName, version);

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  let httpsConfig;

  if (env.HTTPS_PEM_CERT_PATH && env.HTTPS_PEM_KEY_PATH) {
    httpsConfig = {
      key: fs.readFileSync(env.HTTPS_PEM_KEY_PATH),
      cert: fs.readFileSync(env.HTTPS_PEM_CERT_PATH),
    };
  }

  if (env.HTTPS_PFX_PATH) {
    httpsConfig = {
      pfx: fs.readFileSync(env.HTTPS_PFX_PATH),
      passphrase: env.HTTPS_PFX_PASSWORD,
    };
  }

  return {
    plugins: [
      react({ jsxRuntime: 'classic' }),
      dts({
        tsconfigPath: "./tsconfig.json",
        outDir: "./dist/types",
        include: ["./lib"],
      }),
      weavyAuthServer(command),
    ],
    define: {
      WEAVY_SOURCE_NAME: JSON.stringify(sourceName),
      WEAVY_VERSION: JSON.stringify(version),
      WEAVY_URL: JSON.stringify(env.WEAVY_URL),
      //WEAVY_TOKEN_URL: JSON.stringify(env.WEAVY_TOKEN_URL),
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
    },
    server: {
      /*proxy: {
        "/api": "http://localhost:3001/",
      },*/
      https: httpsConfig,
    },
    esbuild: {
      legalComments: "none",
      charset: "utf8",
      //banner: "\ufeff", // UTF-8 BOM
      keepNames: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      }
    },
    build: {
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
            format: "esm",
            entryFileNames: "weavy.mjs",
            minifyInternalExports: false,
          },
          {
            format: "cjs",
            entryFileNames: "weavy.cjs",
            minifyInternalExports: false,
            dynamicImportInCjs: true,
          },
        ],
      },
    },
  };
});
