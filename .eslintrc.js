module.exports = {
  extends: ["airbnb", "prettier"],
  env: {
    node: true,
    browser: true,
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"]
    },
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"]
      }
    },
    react: {
      version: "detect"
    }
  },
  rules: {
    "no-console": 0,
    "no-underscore-dangle": 0,
    "no-plusplus": 0,
    "quote-props": 0,
    "object-curly-newline": 0,
    "react/forbid-prop-types": 0,
    "react/jsx-filename-extension": 0,
    "react/sort-comp": 0,
    "no-unused-vars": 1,
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["to"],
        aspects: ["noHref", "invalidHref", "preferButton"],
      },
    ],
  },
};