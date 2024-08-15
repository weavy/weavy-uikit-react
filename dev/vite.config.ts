import "dotenv/config";
import { PluginOption, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "../package.json" with { type: "json" };
import { resolve } from "path";
import dts from 'vite-plugin-dts';
import preserveDirectives from 'rollup-preserve-directives';

const sourceName =
  process.argv.find((s) => s.startsWith("--source-name="))?.split("=")[1] ||
  packageJson.name;
const version =
  process.argv.find((s) => s.startsWith("--version="))?.split("=")[1] ||
  packageJson.version;

console.log(sourceName, version);

function utf8BomPlugin(){
  const options: PluginOption = {
    name: "utf-8-bom",
    generateBundle(options, bundle, _isWrite) {
      Object.keys(bundle).forEach(chunkId => {
        const chunk = bundle[chunkId]
        // @ts-expect-error chunk type
        if (typeof chunk.code === "string") { 
          // @ts-expect-error chunk type
          if (!chunk.code.startsWith("\ufeff")) {
            // @ts-expect-error chunk type
            chunk.code = "\ufeff" + chunk.code;
          }
        }
      })
    }
  }

  return options;
}

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    react(), 
    dts({
      tsconfigPath: "./tsconfig.json",
      outDir: "./dist/types",
      include: ['./lib'] 
    }),
  ],
  define: {
    WEAVY_SOURCE_NAME: JSON.stringify(sourceName),
    WEAVY_VERSION: JSON.stringify(version),
    WEAVY_URL: JSON.stringify(process.env.WEAVY_URL),
    //WEAVY_TOKEN_URL: JSON.stringify(process.env.WEAVY_TOKEN_URL),
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001/",
    },
    //https: httpsConfig,
  },
  esbuild: {
    legalComments: "none",
    charset: "utf8",
    //banner: "\ufeff", // UTF-8 BOM
    keepNames: true
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "../lib/index.ts"),
      name: "WeavyLib",
      // the proper extensions will be added
      fileName: "weavy"
    },
    sourcemap: false,
    rollupOptions: {
      plugins:[
        utf8BomPlugin(),
        preserveDirectives(),
      ],
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom"],
      output: [
        {
          format: "esm",
          minifyInternalExports: false,
        },
      ],
    },
  },
});
