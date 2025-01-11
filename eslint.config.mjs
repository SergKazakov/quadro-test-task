import js from "@eslint/js"
import eslintConfigXo from "eslint-config-xo"
import eslintPluginImport from "eslint-plugin-import"
import eslintPluginPrettier from "eslint-plugin-prettier/recommended"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import globals from "globals"

export default [
  js.configs.recommended,
  { rules: eslintConfigXo.rules },
  eslintPluginUnicorn.configs.recommended,
  eslintPluginPrettier,
  {
    languageOptions: { globals: globals.node },
    plugins: { import: eslintPluginImport },
    rules: {
      "import/order": [
        "error",
        { "newlines-between": "always", alphabetize: { order: "asc" } },
      ],
      "no-await-in-loop": "off",
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "unicorn/filename-case": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-module": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
]
