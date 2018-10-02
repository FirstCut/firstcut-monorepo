module.exports = function (api) {
  api.cache.forever();
  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
  ];

  const plugins = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-object-rest-spread',
    'transform-class-properties'
  ];

  return {
    presets,
    plugins
  };
};
