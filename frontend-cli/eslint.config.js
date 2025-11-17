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
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
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
      // Block console.log statements - only allow warn and error
      "no-console": ["error", { allow: ["warn", "error"] }],

      // Disable base rule as it can report incorrect errors
      "@typescript-eslint/no-unused-vars": "off",

      // Detect unused imports and variables
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

      // Auto-sort imports alphabetically
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Custom rule to block comments that don't start with TODO, FIXME, NOTE, HACK, or XXX
      "custom-rules/no-regular-comments": "error",

      // Code Quality Rules
      // Prohibir funciones vacías
      "no-empty-function": "error",

      // Prohibir bloques vacíos
      "no-empty": "error",

      // Requerir uso de === y !==
      eqeqeq: ["error", "always"],
      // Prohibir comparaciones confusas
      "no-confusing-arrow": ["error", { allowParens: true }],

      // Prohibir condiciones constantes en loops
      "no-constant-condition": "error",

      // Prohibir código no alcanzable
      "no-unreachable": "error",

      // Prohibir return, throw, continue, break después de bloques finales
      "no-unsafe-finally": "error",

      // Prohibir asignaciones en condiciones
      "no-cond-assign": ["error", "always"],

      // Prohibir uso de variables antes de definirlas
      "@typescript-eslint/no-use-before-define": [
        "error",
        {
          functions: false,
          classes: true,
          variables: true
        }
      ],

      // Prohibir return innecesario en else después de return en if
      "no-else-return": ["error", { allowElseIf: false }],

      // Code Style Rules
      // Requerir uso de const cuando la variable no se reasigna
      "prefer-const": "error",

      // Preferir template literals sobre concatenación
      "prefer-template": "error",

      // Preferir arrow functions en callbacks
      "prefer-arrow-callback": "error",

      // Preferir destructuring
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

      // Preferir spread operator
      "prefer-spread": "error",

      // Requerir nombres descriptivos en funciones
      "func-names": ["error", "always"],

      // Consistencia en uso de comillas dobles
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
    ignores: ["node_modules/**", "dist/**", "templates/**", "*.config.js", "eslint-rules/**"]
  }
]
