var path = require('path');
var webpack = require('webpack');
var babelSettings = {
	cacheDirectory: true,
	'presets': [
		'es2015', // used for 'import', sweetjs calls this too; tried alt. `{ foo } = require('pkg')` but fails with lazy imports
		// 'stage-0', // 0 for await, 1 for [assigned methods](https://github.com/jeffmo/es-class-fields-and-static-properties)
	],
	'plugins': [
		'syntax-async-functions', // async/await
		'transform-regenerator',
		'transform-runtime',
		'add-module-exports',
		'transform-decorators-legacy', // @
		'angular2-annotations',	// @Component, etc.
		'transform-class-properties',
		'transform-flow-strip-types',
	],
};

function q(loader, query) {
  return loader + '?' + JSON.stringify(query);
}

var babel = q('babel', babelSettings);
var ts = q('ts', {});

module.exports = {
	context: path.join(__dirname),
	entry: {
		server: './src/server/index',
		client: './src/client/index',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	// https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'eval', //'source-map',
	module: {
		loaders: [
			{
				test: /\.ts$/,
				loaders: [
					babel,
					ts,
				],
			},
			{
				test: /\.js$/,
				//exclude: [ path.resolve(__dirname, 'node_modules'), ],
				include: [
					path.resolve(__dirname, 'app'),
				],
				loaders: [
					// sweet,
					babel,
					// ts,		// no point, TSC won't even load JS files?
				],
			},
			{ test: /\.html$/, loader: 'html' },
			{ test: /\.jade$/, loader: 'html!jade-html' },
			// style!css!cssnext!autoprefixer! over raw! for non-ng2 inclusion
			// { test: /\.less$/, loader: 'raw!less' },	//raw is for ng2 `styles: [require('./style.less')]`
			// ^ ng2 sucks for css though -- `css` loader pre-resolves urls, `style` injects into DOM.
			{ test: /\.less$/, loader: 'style!css!less' },
			{ test: /\.css$/, loader: 'style!css' },
			// { test: /\.(jpe?g|png|gif|ttf|eot|svg|woff(2)?|wav|mp3)$/, loader: 'file' }
		],
	},
	resolve: {
		extensions: [
			// you can now require('file') instead of require('file.coffee')
			'', '.js', '.ts', '.json', '.jade', '.css', '.less', '.sass', '.scss', '.html'
		],
		// root: ['node_modules', 'app'].map((folder) => path.join(__dirname, folder))
		modulesDirectories: ['node_modules', 'app'],
		root: __dirname
	},
	// noParse: [/\/dist\//],
  ts: {
		transpileOnly: true,
 	}
}
