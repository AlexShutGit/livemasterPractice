/**
 * Webpack config for Livemaster App.
 */

/* global require */
/* global module */
/* global __dirname */
/* eslint-disable */

// TODO: Сделать рефакторинг существующих сборок, выделяить общие части, избавится от дублирования.
const path = require('path');
const Webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {
	getFilename,
	getManifestProps,
} = require('./webpack/config/util');
const { cssLoaders } = require('./webpack/config/css-config');
const CONFIG = require('./webpack/entries');
const PACKAGE_JSON = require('./package.json');

function resolve(dir) {
	return path.join(__dirname, dir);
}

const smp = new SpeedMeasurePlugin();

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	// TODO: Возможно стоит отказаться от этого парамметра
	const hasHash = isProduction;
	const shouldUseSourceMap = true; // Source maps для практикума Boolean(process.env.npm_config_sourcemap);
	const shouldUseAnalyzer = Boolean(process.env.npm_config_analyze);
	process.env.NODE_ENV = argv.mode;

	const webpackConfig = smp.wrap({
		devtool: !isProduction && !shouldUseSourceMap
			? 'cheap-module-source-map' : false,
		watch: !isProduction,
		watchOptions: {
			ignored: /node_modules/
		},
		bail: isProduction,
		cache: true,
		context: resolve('js/'),
		entry: CONFIG.entry,
		output: {
			path: resolve('dist'),
			publicPath: '/dist/',
			filename: getFilename(isProduction, hasHash, 'js'),
			chunkFilename: getFilename(isProduction, hasHash, 'js'),
		},
		plugins: [
			// SourceMapDevToolPlugin используется вместо опции devtool, из-за проблем с генерацией исходных карт на ЯТалантах.
			!isProduction
			&& shouldUseSourceMap
			&& new Webpack.SourceMapDevToolPlugin(),
			new MiniCssExtractPlugin({
				filename: getFilename(isProduction, hasHash, 'css'),
			}),
			new ManifestPlugin(
				getManifestProps(hasHash)
			),
			new CleanWebpackPlugin(),
			new Webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				'window.jQuery': 'jquery',
			}),
			new Webpack.DefinePlugin({
				IS_PRODUCTION: JSON.stringify(isProduction),
				VERSION: JSON.stringify(PACKAGE_JSON.version),
			}),
			// Todo поидее не нужно
			// new CopyPlugin({
			// 	patterns: [
			// 		{
			// 			from: resolve('js/lib'),
			// 			to: resolve('dist')
			// 		}
			// 	],
			// }),
			// Todo добавить конфигурацию ESlint
			// new ESLintPlugin({
			// 	extensions: ['js'],
			// 	cache: true,
			// }),
			shouldUseAnalyzer && new BundleAnalyzerPlugin(),
		].filter(Boolean),
		resolve: {
			extensions: ['.js', '.jsx', '.json', '.sw.js'],
			modules: [
				path.resolve(__dirname),
				path.resolve(__dirname, 'node_modules'),
			],
			alias: {
				'@css': resolve('/css/'),
			},
		},
		resolveLoader: {
			modules: [
				'node_modules',
				path.resolve(__dirname, 'js/modules/'),
			],
			extensions: ['.js', '.scss', '.sw.js'],
		},
		module: {
			rules: [
				{
					test: require.resolve('jquery'),
					loader: 'expose-loader',
					options: {
						exposes: ['$', 'jQuery'],
					},
				},
				// todo Мультиязычность на практикуме не нужна думаю
				// {
				// 	test: path.resolve('js/i18n'),
				// 	loader: 'expose-loader',
				// 	options: {
				// 		exposes: ['i18n'],
				// 	},
				// },
				{
					test: /\.(css)$/,
					use: cssLoaders(isProduction, shouldUseSourceMap),
				},
				{
					test: /\.(s[ca]ss)$/,
					use: cssLoaders(isProduction, shouldUseSourceMap, [{
						loader: 'sass-loader',
						options: {
							sourceMap: !isProduction && shouldUseSourceMap,
						},
					}]),
				},
				{
					test: /\.jsx?$/,
					include: [resolve('js/')],
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								cacheDirectory: true,
							},
						},
					],
				},
			]
		},
		optimization: {
			removeAvailableModules: true, //удалять модули, когда эти модули уже включены во все родительские элементы
			minimizer: [
				new TerserPlugin({
					cache: true, //кеширование файлов
					parallel: true, //распараллеливание для ускорения
					sourceMap: !isProduction && shouldUseSourceMap, //выгружать исходники для отладки
					terserOptions: {
						output: {
							comments: false,
						}
					},
				}),
				new CssMinimizerPlugin({
					minimizerOptions: {
						preset: [
							'default',
							{
								discardComments: {
									removeAll: true
								},
							},
						],
					},
				}),
			],
			splitChunks: {
				cacheGroups: {
					vendor: {
						name: 'vendor',
						chunks: 'all',
						minChunks: 20
					}
				}
			},
			runtimeChunk: {
				name: 'runtime',
			},
			noEmitOnErrors: false,
			concatenateModules: true
		},
		stats: { //Параметры выводы процесса сборки
			timings: true,
			env: true,
			version: true,
			builtAt: true,
			assets: true,
			entrypoints: false,
			modules: true,
			maxModules: 0,
			chunks: false, //Для вывода размера собранных файлов выставить true
			all: false,
			modules: false,
			errors: true,
			warnings: false,
			moduleTrace: false,
			errorDetails: true,
		}
	});

	return webpackConfig;
};
