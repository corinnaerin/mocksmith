module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    // Adds typed linting, but requires a tsc to provide type info.
    // If the lint becomes too slow, consider forking this to a separate eslint thread.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  ignorePatterns: ["node_modules/", "dist/", "prettier.config.js", "jest.config.js", "config/"],
  rules: {
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": "error",
    // This pkg uses too much generic typing, this just becomes impossible to avoid
    "@typescript-eslint/ban-types": "off",
    eqeqeq: "error",
    "no-restricted-imports": ["error", "lodash"],
    "import/no-dynamic-require": "error",
    "import/no-self-import": "error",
    "import/no-useless-path-segments": "error",
    "import/no-mutable-exports": "error",
    "import/no-commonjs": "error",
    "import/no-amd": "error",
    "import/no-nodejs-modules": "error",
    "import/no-duplicates": "error",
    "import/first": "error",
    "import/no-unassigned-import": "error",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": "typescript",
  },
};
