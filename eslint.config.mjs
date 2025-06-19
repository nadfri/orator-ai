/* eslint-disable import/no-anonymous-default-export */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("next", "next/core-web-vitals", "prettier"),
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "warn",
      "no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 1, maxBOF: 0 }],

      // Autres règles
      camelcase: "off",
      "import/prefer-default-export": "off",
      "react/jsx-filename-extension": "off",
      "react/jsx-props-no-spreading": "off",
      "react/no-unused-prop-types": "off",
      "react/require-default-props": "off",
      "react/no-unescaped-entities": "off",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
        },
      ],
    },
  },
  ...compat
    .extends("plugin:@typescript-eslint/recommended", "prettier")
    .map((config) => ({
      ...config,
      files: ["**/*.+(ts|tsx)"],
    })),
  {
    files: ["**/*.+(ts|tsx)"],
    plugins: {
      "@typescript-eslint": typescriptEslintEslintPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      // Désactiver les règles ESLint de base qui sont remplacées par TypeScript
      "no-unused-vars": "off", // Désactivé pour éviter les doublons
      "no-use-before-define": "off", // Désactivé pour éviter les doublons

      // Règles TypeScript
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-use-before-define": ["warn"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn", // Utiliser la version TypeScript
    },
  },
  // Add ignore patterns for node_modules and .next
  { ignores: ["node_modules/**", ".next/**", "coverage/**"] },
];
