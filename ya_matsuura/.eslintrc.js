module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'vue',
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'prettier/prettier': [
      'off', // disable prettier rules
      {
        singleQuote: true,
        trailingComma: 'all',
        semi: false,
        printWidth: 120,
      },
    ],

    // prettier handles these rules
    'semi': [2, 'never'],
    'function-paren-newline': ['off'],
    'comma-dangle': [2, 'always-multiline'],
    'object-curly-newline': ['off'],
    'max-len': ['error', {
      code: 120,
      ignoreUrls: true
    }],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error']
      }
    ],
    // vue
    'vue-types/require-default-prop': ['off'],
    'vue/require-default-prop': ['off'],
  },
}
