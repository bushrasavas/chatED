import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["babel.config.js"],

    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        __DEV__: true,
      },
    },
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    ...js.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    
    rules: {
      "react/prop-types": "off",
    },
  },
]);
