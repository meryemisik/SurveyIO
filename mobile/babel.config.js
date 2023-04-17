module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
      }
    ],
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-reanimated/plugin'
  ],
};
