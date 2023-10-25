/**
 * Copyright (c) 2017-present, Livemaster, LLC.
 *
 * @fileOverview Shared data methods.
 *
 * @module @lm/modules/utilities/data
 * @author Ilya Reshetnikov <ireshetnikov@livemaster.ru>
 * @version 0.4.1
 */

import ERROR from 'js/modules/utilities/error';
import TYPE from 'js/modules/utilities/type';
import { hyphenate } from './util';
import JsErrorsNotifier from 'js/modules/js-errors-notifier';

/**
 * Метод для получения клиентдаты
 *
 * @example
 *
 * const clientData = DATA.getClientData('.clientData');
 *
 * @param   {string} selector - Селектор для елемента с данными
 * @returns {any}             - CLientData
 */
export function getClientData(selector = '') {
	const element = document.querySelector(selector);

	if (!element) {
		return {};
	}

	const dataText = element.innerHTML;

	return safeJsonParse(dataText);
}

/**
 * Получить безопасный результат JSON.parse
 *
 * @param {string} text -  json текст
 */
export function safeJsonParse(text = '') {
	if (!text) {
		return {};
	}

	let parsed = '';

	try {
		parsed = JSON.parse(text);
	} catch (e) {
		const errorNotifier = new JsErrorsNotifier({
			message: `
				func:
					safeJsonParse in modules/utilities/data.js
				textToJson: \`
					${text}
				\`
				error:
					${e}
			`,
			url: window.location.href,
			lineNo: '',
			columnNo: '',
			error: String(e),
			host: window.location.host,
			protocol: window.location.protocol,
		});
		errorNotifier.sendError();
	}

	return parsed || {};
}

/**
 * Метод возврашает значение data атрибута или свйочтва объекта.
 *
 * @example
 *
 * const elem = document.querySelector('.elem');
 * const dataName = 'type';
 * const data = DATA.get(elem, dataName);
 *
 * @param   {object|DOMElement} element  - Объект или DOMElement
 * @param   {string}            name     - Имя свойства содержащее данные
 * @returns {any}                        - Значение сввойства
 */
export function getData(element, name) {
	if (TYPE.isObject(element[name])) {
		return element[name];
	} else if (element.dataset) {
		return element.dataset[name];
	}

	return element.getAttribute(`data-${hyphenate(name)}`);
}

/**
 * Метод устанавливает значение дата атрибута или свойства объекта.
 *
 * @example
 *
 * const elem = document.querySelector('.elem');
 * const dataName = 'type';
 * const dataValue - 'string';
 * const data = DATA.set(elem, dataName, dataValue);
 *
 * @param {object|DOMElement} element  - Объект или DOMElement.
 * @param {string}            name     - Имя устанавливаемого параметра.
 * @param {any}               data     - Значение устанавливаемого параметра.
 */
export function setData(element, name, data) {
	if (TYPE.isObject(data)) {
		element[name] = data;
	} else if (element.dataset) {
		element.dataset[name] = data;
	} else {
		element.setAttribute(`data-${hyphenate(name)}`, data);
	}
}

/**
 * Метод удаляет значение дата атрибута или свойства объекта.
 *
 * @example
 *
 * const elem = document.querySelector('.elem');
 * const dataName = 'type';
 * const data = DATA.remove(elem, dataName);
 *
 * @param {object|DOMElement} element  - Объект или DOMElement.
 * @param {string}            name     - Имя удалаяемого параметра.
 */
export function remove(element, name) {
	if (TYPE.isObject(element[name])) {
		delete element[name];
	} else if (element.dataset) {
		/** Safari not allows to delete dataset property */
		try {
			delete element.dataset[name];
		} catch (e) {
			element.dataset[name] = null;
		}
	} else {
		element.removeAttribute(`data-${hyphenate(name)}`);
	}
}

/**
 * @param {string} dataString  - Json string
 * @returns {Object}
 */
export function strictJSONParse(dataString) {
	const obj = JSON.parse(dataString);

	ERROR.assert(!TYPE.isString, 'Params "dataString" is not string');
	ERROR.assert(!obj || typeof obj !== 'object', 'JSON string is not object');

	return obj;
}

export default {
	getClientData,
	get: getData,
	set: setData,
	remove,
	strictJSONParse,
};
