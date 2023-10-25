/**
 * Конфиг css для webpack
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getPostCssPlugins = (isProduction) => ([
	require('postcss-mq-optimize')(),
	require('postcss-flexbugs-fixes')(),
	require('autoprefixer')(),
].filter(Boolean));

const cssLoaders = (isProduction, shouldUseSourceMap, extra = []) => {
	const loaders =
		[
			{
				loader: MiniCssExtractPlugin.loader,
				options: {
					publicPath: '/',
				},
			},
			{
				loader: 'css-loader',
				options: {
					// eslint-disable-next-line no-magic-numbers
					importLoaders: 1 + extra.length,
					url: false,
					sourceMap: !isProduction && shouldUseSourceMap,
				},
			},
			{
				loader: 'postcss-loader',
				options: {
					postcssOptions: {
						plugins: getPostCssPlugins(isProduction),
					},
				},
			},
			...extra
		].filter(Boolean);

	return loaders;
};

module.exports = {
	cssLoaders
};
