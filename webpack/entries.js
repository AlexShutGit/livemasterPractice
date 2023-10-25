/**
 * Точки входа для многостраничного приложения
 */

const path = require('path');

/* global module */
/* global require */

module.exports = {
	entry: {
		/*
		 * Объявление точки входа для страницы example
		 *
		 * 'home' - название чанка,
		 * './pages/home' - директории из которых будет собираться чанк
		 */
		'home': './pages/home',
		'vendor': [
			require.resolve('jquery'),
			require.resolve('jquery-ui'),
			require.resolve('store'),
			require.resolve('jed'),
			path.resolve(__dirname, 'polyfills.js'),
		],
	}
};