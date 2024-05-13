import globals from 'globals'
import { plugin } from 'mongoose'
import stylisticJs from '@stylistic/eslint-plugin-js'
import js from '@eslint/js'

export default [
  { files: ['**/*.js'],
    ignores: ["dist/**/*"],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.browser
    },
    'plugins': {
      '@stylistic/js': stylisticJs
    },
    ...js.configs.recommended,
    'rules': {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/linebreak-style': [
          'error',
          'unix'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console': 0
    }
  }
]
