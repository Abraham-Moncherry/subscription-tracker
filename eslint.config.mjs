import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules, // <-- include default rules
      eqeqeq: ["error", "always"],     // <-- add custom rule here
    },
  }
]);

