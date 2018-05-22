// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: './eslint.config.json',
  // required to lint *.vue files
  plugins: [
    'html'
  ]
}
