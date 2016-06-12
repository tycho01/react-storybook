import path from 'path';
import webpack from 'webpack';
import fs from 'fs';

const logger = console;

var babelSettings = {
	cacheDirectory: true,
	"presets": [
		"es2015",
    "stage-2",
    "stage-1",
		"stage-0",
	],
	"plugins": [
		"syntax-async-functions",
		"transform-regenerator",
		"transform-runtime",
		"add-module-exports",
		"transform-decorators-legacy", // @
		"angular2-annotations",	// @Component, etc.
		"transform-class-properties",
		"transform-flow-strip-types",
	],
};

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    admin: [
      'stack-source-map/register',
      path.resolve(__dirname, '../client/init_admin'),
    ],
    preview: [
      'stack-source-map/register',
      'webpack-hot-middleware/client',
      path.resolve(__dirname, '../client/init_preview'),
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: babelSettings,
        exclude: [path.resolve('./node_modules'), path.resolve(__dirname, 'node_modules')],
        include: [path.resolve('./'), __dirname],
      },
      { test: /\.ts$/, loader: 'ts' },
      { test: /\.jade$/, loader: 'html!jade-html' },
      { test: /\.css$/, loader: 'raw' },
      { test: /\.less$/, loader: 'raw!less' },
    ],
  },
  resolve: {
		extensions: ['', '.js', '.ts', '.html', '.jade', '.css', '.less', '.sass', '.scss'],
	},
};

// add config path to the entry
const configDir = path.resolve('./.storybook');
const storybookConfigPath = path.resolve(configDir, 'config.js');
if (!fs.existsSync(storybookConfigPath)) {
  logger.error('=> Create a storybook config file in ".storybook/config.js".\n');
  process.exit(0);
}
config.entry.preview.push(storybookConfigPath);

// load custom webpack configurations
const customConfigPath = path.resolve(configDir, 'webpack.config.js');
if (fs.existsSync(customConfigPath)) {
  const customConfig = require(customConfigPath);
  if (customConfig.module.loaders) {
    logger.log('=> Loading custom webpack loaders.');
    config.module.loaders =
      config.module.loaders.concat(customConfig.module.loaders);
  }

  if (customConfig.plugins) {
    logger.log(' => Loading custom webpack plugins.');
    config.plugins = config.plugins.concat(customConfig.plugins);
  }
}

export default config;
