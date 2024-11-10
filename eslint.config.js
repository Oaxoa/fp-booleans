import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import PluginImport from 'eslint-plugin-import';

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	eslintConfigPrettier,
	{
		ignores: ['coverage/', 'dist/', 'assets/', '.github/', 'node_modules/'],
	},
	{
		languageOptions: {
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: { import: PluginImport },
		rules: {
			'no-console': 'off',
			'import/no-unresolved': 'off',
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
];
