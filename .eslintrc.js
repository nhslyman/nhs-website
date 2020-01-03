module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/recommended",
    "@vue/prettier",
    "@vue/typescript",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": "off" // broken on typescript getters
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  }
};
