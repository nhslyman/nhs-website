module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/recommended",
    "@vue/typescript",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": "off", // broken on typescript getters
    "vue/no-v-html": "off" // only content fom officers is inserted
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  }
};
