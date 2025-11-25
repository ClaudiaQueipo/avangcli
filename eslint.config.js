import js from "@eslint/js"
import tseslint from "typescript-eslint"
import globals from "globals"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import unusedImports from "eslint-plugin-unused-imports"
import noRegularComments from "./eslint-rules/no-regular-comments.js"

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      "custom-rules": {
        rules: {
          "no-regular-comments": noRegularComments
        }
      }
    },
    rules: {
      // NOTE: Block console.log statements - only allow warn and error
      "no-console": ["error", { allow: ["warn", "error"] }],

      // NOTE: Disable base rule as it can report incorrect errors
      "@typescript-eslint/no-unused-vars": "off",

      // NOTE: Detect unused imports and variables
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],

      // NOTE: Auto-sort imports alphabetically
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // NOTE: Custom rule to block comments that don't start with TODO, FIXME, NOTE, HACK, or XXX
      "custom-rules/no-regular-comments": "warn",

      // NOTE: Code Quality Rules
      "no-empty-function": "error",
      "no-empty": "error",
      eqeqeq: ["error", "always"],
      "no-confusing-arrow": ["error", { allowParens: true }],
      "no-constant-condition": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "error",
      "no-cond-assign": ["error", "always"],
      "@typescript-eslint/no-use-before-define": [
        "error",
        {
          functions: false,
          classes: false,
          variables: false
        }
      ],
      "no-else-return": ["error", { allowElseIf: false }],

      // NOTE: Code Style Rules
      "prefer-const": "error",
      "prefer-template": "error",
      "prefer-arrow-callback": "error",
      "prefer-destructuring": [
        "error",
        {
          array: true,
          object: true
        },
        {
          enforceForRenamedProperties: false
        }
      ],
      "prefer-spread": "error",
      "func-names": ["error", "always"],
      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: true
        }
      ]
    }
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".next/**",
      "coverage/**",
      "templates/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "eslint-rules/**",
      ".husky/**",
      "frontend-cli/templates/**",
      "frontend-cli/node_modules/**",
      "frontend-cli/dist/**",
      "frontend-cli/commitlint.config.js",
      "web-docs/node_modules/**",
      "web-docs/.next/**",
      "web-docs/build/**",
      "web-docs/next-env.d.ts",
      "web-docs/next.config.mjs",
      "commitlint.config.js"
    ]
  }
]
