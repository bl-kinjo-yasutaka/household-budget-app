import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Storybook ESLint rules with overrides
  ...compat.extends("plugin:storybook/recommended"),
  {
    files: ["**/*.stories.@(js|jsx|ts|tsx)", ".storybook/**/*"],
    rules: {
      "storybook/hierarchy-separator": "off",
      "storybook/prefer-pascal-case": "off",
      "storybook/story-exports": "off",
      "storybook/no-uninstalled-addons": "off",
    },
  },
];

export default eslintConfig;
