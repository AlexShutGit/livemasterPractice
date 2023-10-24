/* eslint-disable */
import {singleLineString} from 'js/modules/utilities/tag';
import escape from 'lodash-es/escape';

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (searchStr, Position) {
		if (!(Position < this.length)) {
			Position = this.length;
		} else {
			Position |= 0;
		}
		return this.substr(Position - searchStr.length, searchStr.length) === searchStr;
	};
}
/* eslint-enable */

/**
 * Escape symbol by html entities
 *
 * @example
 * htmlEscape(<div/>) // -> &lt;div/&gt;
 *
 * @param {string} str  - Текст шаблона помещенного в `tagged template literals`
 * @returns {string}
 */
export function htmlEscape(str) {
	return escape(str);
}

/**
 * Функция тега проверяет текст, предшествующий подстановке, чтобы определить,
 * следует ли экранировать или нет.
 *
 * @example
 * html`<option value="${option.value}">${option.name}</option>`
 *
 * @param {string} strings - объект template String
 * @param {any}    substitutions  - Подставляемые части
 * @returns {string}
 */
export function html(strings, ...substitutions) {
	/* eslint-disable no-extend-native */
	/* eslint-disable no-param-reassign */
	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function(searchStr, Position) {
			// This works much better than >= because
			// it compensates for NaN:
			if (!(Position < this.length)) {
				Position = this.length;
			} else {
				// eslint-disable-next-line no-magic-numbers
				Position = 0;
			} // round position
			return (
				this.substr(Position - searchStr.length, searchStr.length) === searchStr
			);
		};
	}
	/* eslint-enable no-param-reassign */
	/* eslint-enable no-extend-native */

	const SLICE_PARAM_START = 0;
	const SLICE_PARAM_END = -1;
	const RESULT_REDUCE_NUMBER = 1;
	const raw = strings.raw;

	let result = '';

	substitutions.forEach((subst, i) => {
		let literal = raw[i];
		let substitution = subst;

		if (Array.isArray(subst)) {
			substitution = subst.join('');
		}

		if (literal.endsWith('!')) {
			substitution = escape(substitution);
			literal = literal.slice(SLICE_PARAM_START, SLICE_PARAM_END);
		}
		result += literal;
		result += substitution;
	});
	result += raw[raw.length - RESULT_REDUCE_NUMBER];

	return singleLineString`${result}`;
}

/**
 *
 * @param {string} str  - исходная строка
 * @returns {string}
 */
export function trim(str) {
	return str.replace(/^\s+/gm, '');
}

/**
 * Преобразование строки с суммой в формат отображения чисел с пробелом
 *
 * @param {string | number} value - ЗНачение для преобразования
 * @returns {string}
 */
export function numberWithSpaces(value) {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Удаляет все пробелы из строки
 *
 * @param {string} value - значение для преобразования
 * @returns {string}
 */
export function nospace(value) {
	let regExp = new RegExp(/\s|\u00A0+/g);

	return value.toString().replace(regExp, '');
}

/**
 * Заменяет каждый js перевод на новую строку html эквивалентом
 * Удаляет переводы/пробельные символы с начала и конца строки
 * Удаляет больше 2-х переводов подряд
 *
 * @param {string} value - значение для преобразования
 * @returns {string}
 */
export function smartNewlineToHtmlTag(value) {
	let regexpNewline = /[\n]/g;
	let regexpTrim = /^\s+|\s+$/g;
	let regexpSmartNewline = /((<br>)\2{1})\2+/g;

	return value
		.toString()
		.replace(regexpTrim, '')
		.replace(regexpNewline, '<br>')
		.replace(regexpSmartNewline, '<br><br>');
}

/**
 * Заменить повторяющиеся пробелы и/или &nbsp; на единственный пробельный символ
 *
 * @param {string} string - текст для преобразования
 * @returns {string}
 */
export const smartSpacesAdjustment = (string = '') =>
	string
		.toString()
		.trim()
		.replace(/ +|(&nbsp;)+/g, ' ');

/**
 * Возвращает текст без html тегов. <br> заменяет на перевод на новую строку ([\r\n])
 *
 * @param {string} string - текст для "очистки"
 * @returns {string}
 */
export const getClearedFromHtmlText = (string = '') =>
	string
		.toString()
		.trim()
		.replace(/<br>/g, '\n')
		.replace(/<+[^>]+>/g, '');

/**
 * Удаляет из строки скрипты
 *
 * @param {string} value - ЗНачение для преобразования
 * @returns {string}
 */
export function stripScripts(value) {
	let fakeDiv = document.createElement('div');

	fakeDiv.innerHTML = value;

	let scripts = fakeDiv.getElementsByTagName('script');
	let scriptLen = scripts.length;

	while (scriptLen--) {
		scripts[scriptLen].parentNode.removeChild(scripts[scriptLen]);
	}

	return fakeDiv.innerHTML;
}

export default {
	html,
	htmlEscape,
	nospace,
	smartNewlineToHtmlTag,
	getClearedFromHtmlText,
	numberWithSpaces,
	stripScripts,
	trim,
};
