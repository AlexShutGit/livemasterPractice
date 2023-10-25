'use strict';
/** @module Util/error */

import { TYPE } from './index';
import logLevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

const getNormalizeLevel = (level) => {
	let normalizeLevel;
	switch (level) {
		case 'trace':
		case 'debug':
		case 'info':
		case 'warn':
		case 'error':
			normalizeLevel = level;
			break;
		default:
			normalizeLevel = 'warn';
			break;
	}

	return normalizeLevel;
};

export default {
	/**
	 *
	 * TODO: Переименоать asset в throw
	 * TODO: Переработать метод добившись более информативуного выхлопа
	 *       на подобии @see http://gunargessner.com/subclassing-exception/
	 *
	 * В случае не выполнения условия кидает исключение.
	 *
	 * @example
	 * const condition = !TYPE.isString;
	 * const errString = 'Element не является строкой';
	 * ERROR.assert(condition. errString);
	 * //=> throw new Error('Element не является строкой')
	 *
	 * @param   {bolean}  condition  - Условие для проверки.
	 * @param   {string}  message    - Сообщение об ошибке в случае сбоя.
	 * @throws  {Error}              - Когда условие(condition) можно привести к false
	 */
	assert(condition, message = 'Assertion failed') {
		if (!condition) {
			throw new Error(`LM framework - ${message}`);
		}
	},

	/**
	 * Try
	 *
	 * @example
	 * tryCatch(somefunction)
	 *
	 * @param {Function} fn  - Функция
	 * @returns {Object}
	 *  - {Error} error
	 *  - {Mix} value
	 */
	tryCatch(fn) {
		const res = {
			error: undefined,
			value: undefined
		};

		try {
			res.value = fn();
		} catch (err) {
			res.error = (TYPE.instanceOf(err, Error)) ? err : new Error(err);
		}

		return res;
	},

	/**
	 * @param {any}  message - message
	 * @param {string}  level  - Message level Name ['trace','debug','info','warn','error']
	 * @returns {Function}
	 */
	log(message, level) {
		const normLevel = getNormalizeLevel(level);

		prefix.apply(logLevel, {
			template: 'LM %l :',

			levelFormatter: function (level) {
				const INDEX_FIRST = 0;
				const INDEX_SECOND = 1;
				return level.charAt(INDEX_FIRST).toUpperCase() + level.substr(INDEX_SECOND);
			},
			nameFormatter: function (name) {
				return name || 'global';
			}
		});

		return logLevel[normLevel](message);
	},


};
