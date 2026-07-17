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
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
		...tseslint.configs.disableTypeChecked
	},
	{
		plugins: {
			"@stylistic": stylistic
		},
		rules: {
			"@stylistic/semi": ["error", "always"],
			"@stylistic/quotes": ["error", "double"],
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/comma-dangle": ["error", "never"],
			"@stylistic/eol-last": ["error", "never"],
			"@stylistic/no-tabs": "off",
			"@stylistic/max-statements-per-line": ["error", { max: 2 }]
		}
	}
]);