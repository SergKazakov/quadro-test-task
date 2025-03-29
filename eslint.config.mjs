import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import eslintConfigXo from "eslint-config-xo"
import eslintPluginImport from "eslint-plugin-import"
import eslintPluginPrettier from "eslint-plugin-prettier/recommended"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import typescriptEslint from "typescript-eslint"

export default defineConfig([
  js.configs.recommended,
  { rules: eslintConfigXo.rules },
  eslintPluginUnicorn.configs.recommended,
  ...typescriptEslint.configs.recommended,
  eslintPluginPrettier,
  {
    plugins: { import: eslintPluginImport },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "capitalized-comments": "off",
      "import/order": [
        "error",
        { "newlines-between": "always", alphabetize: { order: "asc" } },
      ],
      "no-await-in-loop": "off",
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "unicorn/filename-case": "off",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
])
