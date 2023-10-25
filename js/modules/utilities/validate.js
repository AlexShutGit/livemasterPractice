import {
	REGEXP_URI,
} from './constant';

const CLEAN_OWN_LINKS_REGEXP = /[^\s\"'\<]+livemaster(\.)(aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|ru|tel|travel|рф|[a-z][a-z])(?:\W|$)/ig;

const FIND_LINKS_REGEXP = /[^\s\"'\<\.]+(\.)(aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|ru|tel|travel|рф|[a-z][a-z])(?:\W|$)/;

function positive(value, rule) {
	return (value && rule.test(value)) ? true : false;
}

function negative(value, rule) {
	return (value && rule.test(value)) ? false : true;
}

export default {
	/**
	 * Проверка на обязательное наличие
	 *
	 * @param {string}  value - Проверяемое значение
	 * @returns {boolean}
	 */
	require (value) {
		return (value && value.length) ? true : false;
	},

	/**
	 * Проверка на минимальную длину
	 *
	 * @param {string}  value - Проверяемое значение
	 * @param {number}  length - Ожидаемая минимальная длина значения
	 * @returns {boolean}
	 */
	minLength (value, length) {
		return (value && value.length >= length) ? true : false;
	},

	/**
	 * Проверка на максимальную длину
	 *
	 * @param {string}  value - Проверяемое значение
	 * @param {number}  length - Ожидаемая максимальная длина значения
	 * @returns {boolean}
	 */
	maxLength (value, length) {
		return (value && value.length > length) ? false : true;
	},

	/**
	 * Проверка на корректно введенный email
	 *
	 * @param {string}  value - Проверяемое значение
	 * @returns {boolean}
	 */
	email (value) {
		return (
			positive(value, new RegExp('[0-9a-z_-]+@[0-9a-z_^.-]+\\.[a-z]{2,4}', 'i'))
		);
	},

	/**
	 * Проверка пароля на наличие цифр, символов в верхнем и нижнем регистре
	 *
	 * @param {string}  value - Проверяемое значение
	 * @returns {boolean}
	 */
	passwordRequiredChars (value) {
		return (
			positive(value, new RegExp('[A-Z]|[А-ЯЁ]')) &&
			positive(value, new RegExp('[a-z]|[а-яё]')) &&
			positive(value, new RegExp('[0-9]'))
		);
	},

	/**
	 * Проверка пароля на отсутствие недопустимых символов (пробельные символы)
	 *
	 * @param {string}  value - Проверяемое значение
	 * @returns {boolean}
	 */
	passwordChars (value) {
		return negative(value, new RegExp('[^\'"`~a-zа-яё0-9.,:;/\\?!«\#»\*\+№&@$\^\{\}\\]\[\=()_–—\-]', 'i'));
	},

	/**
	 * Проверка на то что строка является строкой текста на английском
	 *
	 * @param {string}  value - Проверяемое значение
	 * @returns {boolean}
	 */
	isEnglishString (value) {
		return positive(value, new RegExp('^[a-zA-Z0-9/\\?>\\<\\:;\\*\\.\\,()\\{\\}\\[\\]\\-_\\+\\=\\!@«\\#№»\\$%\\^&\\+\\|"\'\\\s]*$', 'i'));
	},

	/**
	 *
	 *
	 * @param {string}  value - Проверяемое значение
	 * @returns {boolean}
	 */
	notUrl (value) {
		var cleanValue = value.replace(CLEAN_OWN_LINKS_REGEXP, '');

		return negative(cleanValue, FIND_LINKS_REGEXP);
	},

	/**
	 * Проверка строки является ли она валидным uri
	 *
	 * @example
	 *
	 * - VALIDATE.isUri(str);
	 *
	 * @param   {string}  uri - Строка для проверки
	 * @returns {boolean}
	 */
	isUri(uri) {
		return REGEXP_URI.test(uri);
	},

	/* eslint-disable */
	/**
	 * Проверка введенного ИНН на коректность и валидность
	 *
	 * @author Nikita Stavtsev
	 *
	 * @version 1.0
	 *
	 * @param {string}  value - Проверяемое значение ИНН
	 * @returns {boolean}
	 */
	validationINN (value) {
		const lengthInnLLC = 10;
		const lengthInnIE = 12;
		if (!positive(value, new RegExp('^[0-9]{10,12}$', 'i'))) {
			return false;
		}
		let check = function (value, coefficients) {
			let n = 0;
			for (let i = 0; i < coefficients.length; i++) {
				n += coefficients[i] * value[i];
			}
			return parseInt(n % 11 % 10, 10);
		};
		if (value.length === lengthInnLLC) {
			let n10 = check(value, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
			return n10 === parseInt(value[9], 10);
		} else if (value.length === lengthInnIE) {
			let n11 = check(value, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
			let n12 = check(value, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
			return (n11 === parseInt(value[10], 10)) && (n12 === parseInt(value[11], 10));
		}
	},
	/* eslint-enable */

	/**
	 * Проверка номера мобильного телефона РФ
	 *
	 * @author Aleksandr Kozlov
	 *
	 * @version 1.0
	 *
	 * @param {string}  value - Проверяемое значение номера телефона
	 * @returns {boolean}
	 */
	isPhoneNumber(value) {
		return /(8|\+7)\d{10}/.test(value);
	}
};
