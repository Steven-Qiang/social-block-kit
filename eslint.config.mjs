import antfu from '@antfu/eslint-config';

export default config({
  ignores: ['dist/*', 'assets/*'],
});

function config(options = {}, ...userConfigs) {
  return antfu(
    {
      isInEditor: false,
      typescript: true,
      formatters: true,
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },

      vue: {
        overrides: {
          'vue/prefer-template': 'warn',
          'vue/prefer-use-template-ref': 'warn',
          'vue/multi-word-component-names': 'off',
          'vue/component-name-in-template-casing': ['error', 'kebab-case'],
          'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
          'vue/custom-event-name-casing': ['warn', 'kebab-case'],
        },
      },
      unicorn: false,
      ...options,
    },
    {
      rules: {
        'no-console': 'off',
        'no-alert': 'off',
        'no-debugger': 'off',
        'ts/no-explicit-any': 'off',
        'ts/no-require-imports': 'off',

        'style/quote-props': ['warn', 'consistent-as-needed'],
        'style/wrap-regex': ['warn'],
        'style/arrow-parens': ['warn', 'always'],
        'style/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
        'style/comma-dangle': ['warn', 'only-multiline'],
        'antfu/if-newline': 'off',

        'pnpm/json-enforce-catalog': 'off',
        'pnpm/json-valid-catalog': 'off',

        'eqeqeq': ['off'],
        'ts/ban-ts-comment': 'off',
        'ts/no-unsafe-function-type': 'off',
        'no-throw-literal': 'off',
        'node/prefer-global/buffer': 'off',
        'node/prefer-global/process': 'off',
        'node/prefer-global/console': 'off',

        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],
        'prefer-template': 'warn',
      },
    },
    ...userConfigs
  );
}
