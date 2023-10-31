'use strict';
/** @module Util/data */

import acm from 'advanced-cookie-manager';

// import { hyphenate } from './util';

export default {

	/**
	 * Возврашает значение cookie по имени.
	 * Если имя не указана возврашает все в виде массива.
	 *
	 * @example
	 * Cookie.get('myCookie') // 'value'
	 * Cookie.get(); // [[name  : name, value : value], [...], ...}]
	 *
	 * @param    {string} name  - название cookie
	 * @returns  {string}       - значение cookie
	 */
	get(name) {
		return acm.get(name);
	},

	/**
	 * Устанавливает cookie по имени значению и свойствам.
	 *
	 * @example
	 *
	 * Cookie.set('key', 'value', { domain: 'www.example.com'}); // set for domain
	 * Cookie.set('key', 'value', { expires: 3600 }); // Expires in 1 hour
	 * Cookie.set('key', 'value', { expires: new Date(2020, 0, 1) }); // Expires at Wed Jan 01 2020 00:00:00 GMT+0200
	 *
	 * Options:
	 * - `expires`
	 *    Число (в секундах), или объект даты обозначающий время истечения cookies
	 *    По умолчанию: `0`
	 *
	 * - `path`
	 *    Cтрока путь для cookie
	 *    По умолчанию: `/`
	 *
	 * - `domain`
	 *    Домен которому устанавливаю cookies
	 *    По умолчанию `empty` (пустая строка)
	 *
	 * @param {string} name     - имя cookie
	 * @param {string} value    - значение cookie
	 * @param {Object} options  - свойства cookie
	 */
	set(name, value, options) {
		return acm.set(name, value, options);
	},

	/**
	 * Удаляет файл cookie с локальным областью с указанным ключом.
	 *
	 * @example
	 * Cookie.unset('key'); // remove cookies with name 'key'
	 *
	 * @param  {string} name   - название cookie
	 */
	unset(name) {
		// Удаление куки для текущей страницы
		this.set(name, '', {
			expires: 'Thu, 01 Jan 1970 00:00:01 GMT',
			path: '',
		});

		// Удаление глобальной куки (path=/). PS Методы не взаимозаменяемы.
		return acm.unset(name);
	},

	/**
	 * Устанавливает значения по умолчанию в рамках страницы (домена)
	 *
	 * @example
	 * Cookie.initialize({
	 * 		expires : 3600,
	 * 		path : '/',
	 * 		domain : 'www.livemaster.ru',
	 * 	});
	 *
	 * @param  {string}  options   - параметры для установки cookies
	 */
	initialize(options) {
		return acm.initialize(options);
	},

};
