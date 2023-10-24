/**
 * Вспомогательные функции для webpack
 */

function getFilename(isProd, hasHash, ext) {
	return isProd && hasHash ?
		`[name].[contenthash].${ext}` :
		`[name].${ext}`;
}

function getManifestProps(hasHash) {
	const config = {
		seed: {
			version: getVersion()
		},
	};

	return !hasHash ? config : {};
}

function getVersion() {
	const buildDate = new Date();

	let month = buildDate.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}

	let day = buildDate.getDate();
	if (day < 10) {
		day = '0' + day;
	}

	let hours = buildDate.getHours();
	if (hours < 10) {
		hours = '0' + hours;
	}

	let minutes = buildDate.getMinutes();
	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	let seconds = buildDate.getSeconds();
	if (seconds < 10) {
		seconds = '0' + seconds;
	}

	const dateParams = [
		buildDate.getFullYear(),
		month,
		day,
		hours,
		minutes,
		seconds
	];

	return dateParams.join('');
}

module.exports = {
	getVersion,
	getFilename,
	getManifestProps,
};
