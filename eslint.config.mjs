import eslint from "@eslint/js";
import globals from "globals";
import ts_eslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import { reactRefresh } from "eslint-plugin-react-refresh";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  { settings: { react: { version: "18.3" } } },
  {
    ignores: ["**/dist/"],
  },
  eslint.configs.recommended,
  ...ts_eslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactRefresh.configs.vite(),
  {
    files: ["**/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.es2020,
        WEAVY_SOURCE_NAME: "readonly",
        WEAVY_SOURCE_FORMAT: "readonly",
        WEAVY_VERSION: "readonly",
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],
    },
  },
  {
    files: ["./*.[mc]js", "./*.ts", "./dev/*.ts"],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
