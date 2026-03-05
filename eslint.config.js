const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
	js.configs.recommended,
	{
		files: ["src/**/*.js"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "commonjs",
			globals: {
				...globals.node,
			},
		},
		rules: {
			"no-console": "off",
			"no-unused-vars": [
				"warn",
				{
					vars: "all",
					args: "none",
					caughtErrors: "none",
				},
			],
			"no-undef": "error",
			"no-duplicate-case": "error",
			"no-unreachable": "error",
			eqeqeq: ["error", "always"],
			"no-var": "error",
			"prefer-const": [
				"warn",
				{
					destructuring: "any",
				},
			],
			"no-throw-literal": "error",
			"no-return-await": "warn",
			"no-await-in-loop": "warn",
			"no-promise-executor-return": "error",

			"prefer-template": "warn",
			"object-shorthand": "warn",
			"no-useless-concat": "warn",
		},
	},
	{
		files: ["src/scripts/**/*.js"],
		rules: {
			"no-await-in-loop": "off",
		},
	},
	{
		ignores: ["node_modules/**", "dist/**", "src/scripts/lintRunner.js"],
	},
];
