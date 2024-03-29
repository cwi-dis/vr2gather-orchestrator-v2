module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "ignorePatterns": [
    "node_modules/",
    "bin/",
    "webpack.config.js",
    "*.d.ts"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-trailing-spaces": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-unused-vars": "off"
  }
};
