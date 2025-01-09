import eslint from '@eslint/js';
import typescriptEslintParser from '@typescript-eslint/parser';
import tsEslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

// extends in flat config@9.x
const flatConfigs = [
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    name: 'base-config',
    languageOptions: {
      parser: typescriptEslintParser,
      ecmaVersion: 2025,
      globals: {
        ...globals.es2025,
        ...globals.node,
      },

      parserOptions: {
        experimentalDecorators: true,
      },
    },
  },
  // 如果你想要全局配置改规则，你需要在一个对象中仅声明该值
  // https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.ts', '*.{ts,js}'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
];

export default tsEslint.config(...tsEslint.configs.recommended, ...flatConfigs);
