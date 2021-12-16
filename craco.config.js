const CracoAlias = require('craco-alias');
const sassResourcesLoader = require('craco-sass-resources-loader');
const path = require('path');

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: '.',
        tsConfigPath: './paths.json',
      },
    },
    {
      plugin: sassResourcesLoader,
      options: {
        // resources: [
        //   path.join(__dirname, './src/styles/utils/media.scss'),
        //   path.join(__dirname, './src/styles/utils/mixins.scss'),
        // ],
      },
    },
  ],
};
