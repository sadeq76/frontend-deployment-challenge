import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

const typeScriptFiles = ['**/*.{ts,vue}']
const typeScriptRecommendedRules =
  tseslint.configs.recommended.find((config) => config.name === 'typescript-eslint/recommended')?.rules ?? {}

export default [
  { ignores: ['.nuxt/**', '.output/**', 'node_modules/**', 'dist/**', 'coverage/**', 'storybook-static/**'] },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser, extraFileExtensions: ['.vue'] } },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'error',
      'vue/no-v-html': 'error'
    }
  },
  {
    files: ['**/*.ts'],
    languageOptions: { parser: tseslint.parser }
  },
  {
    files: typeScriptFiles,
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      ...typeScriptRecommendedRules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
          varsIgnorePattern: '^_'
        }
      ],
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off'
    }
  },
  eslintConfigPrettier
]
