module.exports = {
  plugins: ["prettier"],
  extends: ["airbnb-typescript/base", "plugin:prettier/recommended"],
  parserOptions: {
    project: "./tsconfig.json",
  },
};
