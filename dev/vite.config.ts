import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "../package.json";
import fs from "node:fs";
import { resolve } from "node:path";
import dts from "unplugin-dts/vite";
import preserveDirectives from "rollup-preserve-directives";
import { checkVersionPrefix, utf8BomPlugin, weavyAuthServer } from "@weavy/uikit-web/utils/vite-plugins.js"

const sourceName = packageJson.name;
const version = packageJson.version;

checkVersionPrefix(packageJson, resolve(__dirname, ".."));

console.log(sourceName, version);

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const define: Record<string, unknown>  = {
    WEAVY_SOURCE_NAME: JSON.stringify(sourceName),
    WEAVY_VERSION: JSON.stringify(version),
    WEAVY_URL: JSON.stringify(env.WEAVY_URL),
    //WEAVY_TOKEN_URL: JSON.stringify(env.WEAVY_TOKEN_URL),
    "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
  };

  if (command === "serve") {
    define.WEAVY_SOURCE_FORMAT = `undefined`
    //define.WEAVY_IMPORT_URL = `"/dist/"`
  }

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
        outDirs: ["./dist/types"],
        include: ["./lib"],
      }),
      weavyAuthServer(command),
    ],
    define,
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
    build: {
      outDir: "dist/build",
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
            intro: `const WEAVY_SOURCE_FORMAT = "esm/dynamic";`,
            minifyInternalExports: false,
          },
          {
            format: "cjs",
            entryFileNames: "weavy.cjs",
            intro: `const WEAVY_SOURCE_FORMAT = "cjs/dynamic";`,
            minifyInternalExports: false,
            dynamicImportInCjs: true,
          },
        ],
      },
    },
  };
});
