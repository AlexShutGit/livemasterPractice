/*eslint no-invalid-this: "off"*/
import { ZERO } from 'js/constants/common';
import { REGEXP_HYPHENATE, REGEXP_TRIM } from './constant.js';

import TYPE from 'js/modules/utilities/type.js';
import isFunction from 'lodash-es/isFunction';

const defaultThreshold = 100;

/**
 * Метод связывает функцию с контекстом, необязательно частично применяя
 *
 * @example
 *
 * const proxedOnToggle = proxy(_params.onToggle, elem);
 * proxedOnToggle(response.code, response.msg);
 *
 * @param   {Function}  fn        - Связываемая функция
 * @param   {any}       context   - Контекст
 * @param   {any}       args      - Список аргументов передаваемых функциb
 * @returns {Function}            - Результирующая функция
 */
export function proxy(fn, context, ...args) {
	return (...args2) => {
		return fn.apply(context, args.concat(args2));
	};
}

/**
 * Преобразование записи через пробел к записи через `-`
 *
 * @param {any} str  - Строка для преобразования.
 * @returns {string}
 */
export function hyphenate(str = '') {
	return String(str).replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
}

/**
 * Удаление лишних пробелов по краям строки
 *
 * @param  {string} str - Строка для обработки
 * @returns {string}
 */
export function trim(str) {
	if (!TYPE.isString(str)) {
		throw new Error(`LM framework - ${str.toString()} is't string`);
	}
	return str.trim ? str.trim() : str.replace(REGEXP_TRIM, '1');
}

const eachArrayStart = 0;
/**
 * each
 *
 * @param  {Object}   obj - Объект содержаший элементы которые необходимо обработать.
 * @param  {Function} callback - Метод вызывающийся для каждого элемента.
 * @returns {Object}
 */
export function each(obj, callback) {
	if (obj && isFunction(callback)) {
		let i;

		if (TYPE.isArray(obj) || TYPE.isNumber(obj.length)) {
			const length = obj.length;

			for (i = eachArrayStart; i < length; i++) {
				if (callback.call(obj, obj[i], i, obj) === false) {
					break;
				}
			}
		} else if (TYPE.isObject(obj)) {
			Object.keys(obj).forEach(key => {
				callback.call(obj, obj[key], key, obj);
			});
		}
	}

	return obj;
}

/**
 * Extend description.
 *
 * @example
 *
 * import { extend } from 'js/modules/utilities/util';
 *
 * extend({}, defaultParams, externalParams);
 *
 * @param  {Object}  obj - e
 * @param  {any} args - e
 *
 * @returns {Object}
 */
export function extend(obj, ...args) {
	const minArgumentsLength = 0;

	if (TYPE.isObject(obj) && args.length > minArgumentsLength) {
		if (Object.assign) {
			return Object.assign(obj, ...args);
		}

		args.forEach(arg => {
			if (TYPE.isObject(arg)) {
				Object.keys(arg).forEach(key => {
					obj[key] = arg[key];
				});
			}
		});
	}

	return obj;
}

/**
 * Debouncing определяет, что функция не будет вызываться снова, пока не пройдет
 * определенное количество времени без ее вызова. Буквально "выполнить эту
 * функцию, только если прошло 100 миллисекунд без ее вызова".
 *
 * @see https://codepen.io/chriscoyier/pen/vOZNQV
 *
 * @example
 * import {throttle} from './modules/utilities/utils'
 *
 * const myFunctionn = debounce(() => {
 *     // some code
 * }, 250);
 * window.addEventListener('resize', myFunctionn);
 *
 * @param {any} func - q
 * @param {any} [threshold=defaultThreshold] - q
 * @param {boolean} [immediate=false] - q
 * @returns {func} - q
 */
export function debounce(func, threshold = defaultThreshold, immediate = false) {
	let timeout;

	return function() {
		const self = this;
		const args = arguments;
		const callNow = immediate && !timeout;

		const later = () => {
			timeout = null;
			if (!immediate) {
				func.apply(self, args);
			}
		};

		clearTimeout(timeout);

		timeout = setTimeout(later, threshold);
		if (callNow) {
			func.apply(self, args);
		}
	};
}

/**
 * Вызывает метод не чаше чем раз в 100ms(по умолчанию).
 * Throttling определяет максимальное количество раз, когда функция может быть
 * вызвана с течением времени. Буквально "выполнить эту функцию не более одного
 * раза каждые 100 миллисекунд.
 *
 * @see https://codepen.io/chriscoyier/pen/vOZNQV
 *
 * @example
 * import {throttle} from './modules/utilities/utils'
 *
 * throttle(myFunc, 200, true);
 * window.addEventListener('resize', myFunctionn);
 *
 * @param {Function} func -
 * @param {number} [delay=100] -
 * @param {boolean} [ignoreLast=false] -
 * @returns {Function}
 */
export function throttle(func, delay = defaultThreshold, ignoreLast = false) {
	let lastTime = 0;
	let timer;

	return function() {
		const context = this;
		const args = arguments;

		const exec = () => {
			lastTime = new Date();
			func.apply(context, args);
		};

		if (timer) {
			clearTimeout(timer);
			timer = null;
		}

		const diff = new Date() - lastTime;

		if (diff > delay) {
			exec();
		} else if (!ignoreLast) {
			timer = setTimeout(exec, delay - diff);
		}
	};
}

const uidPrefixDefaulLength = 6;
const uidBaseLength = 36;
const uidOffset = 1;
/**
 * Возврашает UID с `namespace` постфиксом.
 *
 * @example
 * import {getUID} from './modules/utilities/utils'
 *
 * getUID('viewer-container'); // dg7dl1-viewer-container
 *
 * @param {string} namespace  - Строка для идентификации человеком.
 * @param {number} length     - Длинна префикса
 * @returns {string}
 */
export function getUID(namespace, length = uidPrefixDefaulLength) {
	const randomNumberString =
		Math.pow(uidBaseLength, length + uidOffset) - Math.random() * Math.pow(uidBaseLength, length);
	const prefix = Math.round(randomNumberString)
		.toString(uidBaseLength)
		.slice(uidOffset);
	const postfix = namespace ? `-${namespace}` : '';

	return `${prefix}${postfix}`;
}

/**
 * Вы можете использовать эту пустую функцию, если хотите передать функцию,
 * которая ничего не сделает.
 *
 * @example
 * import {noop} from './modules/utilities/utils'
 * onClick = noop || params.onClick; //
 */
export function noop() {}

/**
 * Содает структуру html из строки-шаблона (unsafe)
 *
 * @param {string} str  - html шаблон
 * @returns {HTMLElements}
 */
export function dom(str) {
	const div = document.createElement('div');
	div.innerHTML = str.trim();
	return div.childNodes[ZERO];
}

/**
 * Fire function Asynchonosly
 *
 * @param {Array} functionsArr - array of fired functions
 * @param {number} timeout - Fimeout before fire
 */
export const fireAsync = (functionsArr, timeout = ZERO) => {
	return functionsArr.forEach(element => setTimeout(element, timeout));
};

/**
 * Async timeoute
 *
 * @param {number} time - timeout before resolve
 * @returns {Promise<any>}
 */
export const delay = time =>
	new Promise(resolve => setTimeout(resolve, time));

/**
 * Метод обертка для получения коректного baseURI в IE и EDGE
 *
 * @returns {string}
 */
export const getBaseURI = () => document.baseURI ? document.baseURI : document.getElementsByTagName('base')[ZERO].href;

/**
 * Формирование абсолютного пути.
 *
 * @param {string} urlPath - путь для резолва
 * @returns {string}
 */
export const resolveBaseURL = (urlPath = '') =>
	(String(urlPath).indexOf('http') === ZERO ? urlPath : `${getBaseURI()}${urlPath.replace(/^\//, '')}`);

/**
 * Возвращает GET параметры из URL
 *
 * @returns {Object}
 */
export const getGETParams = () => {
	const search = window.location.search;
	if (!search) {
		return {};
	}
	const PARAM = 0;
	const VALUE = 1;
	return search.replace('?', '').split('&').reduce((params, item) => {
		const data = item.split('=');
		params[ decodeURIComponent(data[PARAM])] = decodeURIComponent(data[VALUE]);
		return params;
	}, {});
};

/**
 * Скролл к указанному элементу
 *
 * @param {Object} props - должен содержать elem; Может содержать withoutHeader, toBottom, offset
 */
export const scrollToElement = (props = {}) => {
	const DEFAULT_X_POSITION = 0;
	const DEFAULT_ANIMATION_DELAY = 500;
	const {
		elem,
		withoutHeader = true,
		toBottom = false,
		offset = ZERO,
		animation = false,
		animationDelay = DEFAULT_ANIMATION_DELAY,
	} = props;

	if (!elem && !elem.getBoundingClientRect) {
		throw new Error('LM - scrollToElement - некорректный DOM Element или метод getBoundingClientRect не поддерживается');
	}

	const box = elem.getBoundingClientRect();

	const elemHeight = toBottom ? elem.offsetHeight : ZERO;
	const headerOffset = withoutHeader ? document.querySelector('.header-gray-sticky').offsetHeight || ZERO : ZERO;
	const position = box.top + pageYOffset + elemHeight - headerOffset + offset;

	if (!animation) {
		window.scrollTo(DEFAULT_X_POSITION, position);
	} else {
		$('html, body').animate(
			{scrollTop: position},
			animationDelay,
		);
	}
};

/**
 * Promisify a node style async func.
 *
 * @example ```
 *  const asyncPromiseWrapper = promisify(syncFunction, a, b, c);
 *  asyncPromiseWrapper(e)
 *    .then(data => console.log(data.toString('utf8')))
 *    .catch(err => console.log(err));
 * ```
 *
 * @param {Function} fn  - Синхронная функция, которую необходимо привести к асинхронному виду.
 * @param {ArrayLike} args  - Аргументы функции
 * @returns {Promise<any>}
 */
export const promisify = (fn, ...args) =>
	new Promise((resolve, reject) =>
		fn(...args, (error, result) =>
			error && reject(error) || resolve(result)
		)
	);

/**
 * Open link in new tab
 *
 * @param {jQueryEvent|Event} event - объект события клика по ссылке
 */
export const openLinkInNewTab = event => {
	const { target: { href = '' } } = event;

	event.preventDefault();
	event.stopPropagation();

	window.open(href, '_blank');
};

/**
 * Получить результат корректного преобразования string to bool (например 'false' -> false)
 *
 * @param {string} str - строка для преобразования в boolean
 */
export const getCorrectBoolFromStr = (str = '') => (
	str === null
	|| str.toString() === 'NaN'
	|| str.toString() === '0'
	|| str.toString() === 'false'
) ? false : true;

/**
 * Подключает внешний скрипт по ссылке
 *
 * @param {string} url - ссылка на внешний скрипт
 * @param {Function} callback - функция обратного вызова
 * @param {Node} container - контейнер для вставки скрипта
 */
export const includeJs = (url, callback, container) => {
	const script = document.createElement('script');
	const contanerForAppend = container || document.getElementsByTagName('head')[ZERO];
	script.type = 'text/javascript';
	if (script.readyState){
		script.onreadystatechange = () => {
			if (script.readyState === 'loaded' || script.readyState === 'complete') {
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {
		script.onload = () => {
			callback();
		};
	}

	script.src = url;
	contanerForAppend.appendChild(script);
};

/**
 * Реализует глубокое строгое сравнение объектов
 *
 * @param {Object} obj1 - объект сравнения 1
 * @param {Object} obj2 - объект сравнения 2
 */
export const deepObjectCompare = (obj1, obj2) => {
	for (let p in obj1) {
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
			return false;
		}

		switch (typeof (obj1[p])) {
			case 'object':
				if (!deepObjectCompare(obj1[p], obj2[p])) {
					return false;
				}
				break;
			case 'function':
				if (typeof (obj2[p]) === 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) {
					return false;
				}
				break;
			default:
				if (obj1[p] !== obj2[p]) {
					return false;
				}
		}
	}

	for (let p in obj2) {
		if (typeof (obj1[p]) === 'undefined') {
			return false;
		}
	}

	return true;
};

/**
 * Выполняет Ajax-запрос
 *
 * @param url - url-адрес запроса
 * @param data - данные для отправки
 * @param type - тип запроса
 * @param dataType - тип данных ожидаемых от сервера
 * @returns {Promise}
 */
export const sendPromiseAjax = ({ url, data = {}, type = 'POST', dataType = 'json' }) => new Promise((resolve, reject) => {
	$.ajax({ url, data, type, dataType})
		.done((response) => (response.success || response.result) ? resolve(response) : reject(response))
		.fail((response) => reject(response));
});
