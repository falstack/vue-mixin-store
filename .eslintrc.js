module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jest: true
  },
  extends: ['plugin:vue/recommended', '@vue/prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-async-promise-executor': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    cy: true
  }
}
