// @ts-check
import pkg from "@eslint/js";
const { configs } = pkg;
import { config, configs as ts_configs } from "typescript-eslint";
import { configs as angular_configs, processInlineTemplates } from "angular-eslint";
import eslintConfigPrettierFlat from "eslint-config-prettier/flat";

export default config(
  {
    files: ["**/*.ts"],
    extends: [
      configs.recommended,
      ...ts_configs.recommended,
      ...ts_configs.stylistic,
      ...angular_configs.tsRecommended,
      eslintConfigPrettierFlat
    ],
    processor: processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular_configs.templateRecommended,
      ...angular_configs.templateAccessibility,
    ],
    rules: {},
  },
);
