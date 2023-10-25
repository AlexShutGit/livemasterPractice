/** @module @lm/modules/utilities/type */

/**
 * Возврашает `true` если значение равно `array`.
 *
 * @example
 * TYPE.isArray({}) // false
 * TYPE.isArray([]) // true
 *
 * @param   {any}      value  - Проверяемое значение.
 * @returns {boolean}
 */
export function isArray(value) {
	if (!Array.isArray) {
		Array.isArray = function(arg) {
			return Object.prototype.toString.call(arg) === '[object Array]';
		};
	}
	return Array.isArray(value);
}

/**
 * Возврашает `true` если значение равно `string`.
 *
 * @example
 * TYPE.isString({}) // false
 * TYPE.isString('123') // true
 *
 * @param   {any}     value  - Проверяемое значение.
 * @returns {boolean}
 */
export function isString(value) {
	return typeof value === 'string';
}

/**
 * Возврашает `true` если значение равно `number`.
 *
 * @example
 * TYPE.isNumber('123') // false
 * TYPE.isNumber(123) // true
 *
 * @param   {any}     value  - Проверяемое значение.
 * @returns {boolean}
 */
export function isNumber(value) {
	return typeof value === 'number' && !isNaN(value);
}

/**
 * Возврашает `true` если значение равно `true` или `false`.
 *
 * @example
 * TYPE.isBoolean(true); // true
 * TYPE.isBoolean(1); // false
 *
 * @param {any} value - Проверяемое значение.
 * @returns {boolean}
 */
export function isBoolean(value) {
	return value === true || value === false;
}

/**
 * Возврашает `true` if значение равно `undefined`.
 *
 * @example
 * TYPE.isUndefined({}) // false
 * TYPE.isUndefined(undefined) // true
 *
 * @param  {any}  obj -
 * @returns {boolean}
 */
export function isUndefined(obj) {
	return typeof obj === 'undefined';
}

/**
 * Возврашает `true` если значение равно `null`.
 *
 * @example
 * TYPE.isNull(null); // true
 * TYPE.isNull(undefined); // false
 *
 * @param   {any}     value  - Проверяемое значение
 * @returns {boolean}
 */
export function isNull(value) {
	return value === null;
}

/**
 * Вернет `true` если `elem` является `HTMLElement`.
 *
 * @name isElement
 * @example
 * TYPE.isElement(element)
 *
 * @param  {any}  value   - Проверяемое значение
 * @returns {boolean}
 */
export function isElement(value) {
	const T_DOM_NODETYPE = 1; /** TODO: Вынести в глобальный файл. */
	return value && typeof value === 'object' && value.nodeType === T_DOM_NODETYPE;
}

/**
 * Вернет `true` если `value` является `object`.
 *
 * @example
 * TYPE.isObject(obj);
 *
 * @param   {any}      value - Объект для проверки.
 * @returns {boolean}        - True если элемент объект
 */
export function isObject(value) {
	return value && typeof value === 'object' && value !== null && isArray(value) === false;
}

/**
 * Check isPlainObject
 *
 * @example
 * TYPE.isPlainObject(obj);
 *
 * @param   {any}      value  - Объект для проверки.
 * @returns {boolean}         - Returns true if an object was created by the Object constructor
 */
export function isPlainObject(value) {
	if (!isObject(value)) {
		return false;
	}

	try {
		const constructor = value.constructor;
		const prototype = constructor.prototype;

		return constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
	} catch (e) {
		return false;
	}
}

/**
 * Вернет `true` если `value` является `function`.
 *
 * @example
 * TYPE.isFunction(()=> {])); // true
 *
 * @param  {Function} value - Значение для проверки.
 * @returns {boolean}
 */
export function isFunction(value) {
	return typeof value === 'function';
}

/**
 * Вернет `true` если `value` является `RegExp`.
 *
 * @example
 * TYPE.isRegExp(/\s*?/g); // true
 *
 * @param {any} value - Значение для проверки.
 * @returns {boolean}
 */
export function isRegExp(value) {
	return instanceOf(value, RegExp);
}

/**
 * Вернет true если `value` это `Date`.
 *
 * @example
 * TYPE.isDate(new Date()); // true
 *
 * @param {any} value  -
 * @returns {boolean}
 */
export function isDate(value) {
	return isObject(value) && instanceOf(value, Date);
}

/**
 * Возвращает, если `value` является экземпляром заданного `Type`.
 * Это равносильно `Value instanceof Type` с разницей, что `Type`
 * может быть из области видимости которая имеет другой объект
 * верхнего уровня. (Как в случае, если `Type` является Функция из
 * другого модуля iframe / jetpack / sandbox).
 *
 * @example
 * Type.instanceOf(request, Subscribe)
 * // true тк `request` метод класса `Subscribe`
 *
 * @param {any} value - Элемент, свойство, объект который необходимо проверить на принадлежность
 * @param {any} Type  - Элемент на принадлежность которому делается проверка
 * @returns {boolean}
 */
export function instanceOf(value, Type) {
	let isConstructorNameSame;
	let isConstructorSourceSame;
	// Если `instanceof` возвращает `true`, мы сразу получаем результат.
	let isInstanceOf = value instanceof Type;

	// Если `instanceof` возвращает `false`, мы используем
	// ducktype(Утинная типизация) проверку, так как `Type` может быть
	// из `scope`. Если конструктор `value` или конструктор
	// прототипа значения имеет то же имя и источник, мы предполагаем, что это
	// экземпляр типа.
	if (!isInstanceOf && value) {
		isConstructorNameSame = value.constructor.name === Type.name;
		isConstructorSourceSame = String(value.constructor) === String(Type);

		isInstanceOf =
			(isConstructorNameSame && isConstructorSourceSame) || instanceOf(Object.getPrototypeOf(value), Type);
	}
	return isInstanceOf;
}

/**
 * Возвращает тип принимаемого значения в виде строки
 * например: object, function, array, number, string, boolean
 *
 * @param {any} value - значение у которого нужно узнать тип
 * @returns {string}
 */
export function getType(value) {
	/* eslint-disable-next-line */
	return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

export default {
	instanceOf,
	isArray,
	isBoolean,
	isDate,
	isElement,
	isFunction,
	isNull,
	isNumber,
	isObject,
	isPlainObject,
	isRegExp,
	isString,
	isUndefined,
	getType,
};
