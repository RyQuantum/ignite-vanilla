const plugins = [
  [
    "@babel/plugin-proposal-decorators",
    {
      legacy: true,
    },
  ],
  ["@babel/plugin-proposal-optional-catch-binding"],
  "react-native-reanimated/plugin", // NOTE: this must be last in the plugins
  ["@babel/plugin-transform-flow-strip-types", { allowDeclareFields: true }],
]

module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins,
}
