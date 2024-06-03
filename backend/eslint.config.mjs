import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "block-spacing": "error",
      "key-spacing": ["error", {
          "align": {
              "afterColon": true,
              "on": "colon"
          }
      }],
      "keyword-spacing": "error"
    }
  }
];
