import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config([
  {
    ignores: ["dist/**", "node_modules/**", "build/**", "src/scripts/**"]
  },
  stylistic.configs.recommended,
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.ts"]
        },
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    files: ["eslint.config.ts", "**/*.js", "**/*.mjs", "**/*.cjs"],
    ...tseslint.configs.disableTypeChecked
  },
  {
    plugins: {
      "@stylistic": stylistic
    },
    rules: {
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/no-tabs": "error",
      "@stylistic/max-statements-per-line": ["error", { max: 2 }]
    }
  }
]);
