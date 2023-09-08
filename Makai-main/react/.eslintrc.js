module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      modules: "true",
      jsx: true,
    },
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:eslint-comments/recommended",
  ],
  plugins: ["check-file", "regex"],
  rules: {
    "check-file/folder-naming-convention": [
      "error",
      { "src/**/": "FLAT_CASE" },
    ],
    "check-file/filename-naming-convention": [
      "error",
      { "src/**/*.js": "CAMEL_CASE" },
    ],
    "no-restricted-properties": [
      "error",
      { object: ["window"]["location"], property: "reload" },
      { object: ["window"]["location"], property: "href" },
    ],
    "eslint-comments/no-restricted-disable": ["error", "*"],
    "regex/invalid": [
      "error",
      [
        {
          regex: "https://localhost:50001",
          message:
            "NO localhost ALLOWED. Use serviceHelpers for the API Host Prefix",
          files: { ignore: ".eslintrc.js" },
        },
      ],
    ],
    "react-hooks/exhaustive-deps": [0],
    "react/display-name": [0, "never"],
    "react/forbid-prop-types": [2],
    "react/boolean-prop-naming": ["error", { validateNested: true }],
    quotes: [0, "always"],
    semi: [0, "never"],
    "space-before-function-paren": [0, "never"],
    indent: [0, "never"],
    "jsx-a11y/anchor-is-valid": "off",
    "no-script-url": "off",
    camelcase: [
      "error",
      {
        properties: "always",
      },
    ],
    "no-redeclare": [
      2,
      {
        builtinGlobals: true,
      },
    ],
    eqeqeq: [2, "always"],
    "no-unused-vars": [
      2,
      {
        vars: "local",
        args: "after-used",
        ignoreRestSiblings: false,
      },
    ],
    "no-console": [
      2,
      {
        allow: ["none"],
      },
    ],
    "no-alert": [2],
    "no-var": [2],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
