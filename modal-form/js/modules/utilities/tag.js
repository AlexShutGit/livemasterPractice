import trim from 'lodash-es/trim';

const COUNTER_STEP = 1;

/**
 *
 *
 * @param {Array} template  -
 * @param {ArrayLike} expressions  -
 * @returns {string}
 */
export function normal(template, ...expressions) {
	return template.reduce(
		(accumulator, part, i) => accumulator + expressions[i - COUNTER_STEP] + part
	);
}
/**
 * Convert tamplate string literal to string
 *
 * @param {Array} template  - массив значений часте подстановки
 * @param {ArrayLike} expressions  -
 * @returns {string}
 */
export function tagTemplate(template, ...expressions) {
	let output = '';
	for (let i = 0; i < expressions.length; i++) {
		output += template[i] + expressions[i];
	}
	output += template[expressions.length];

	return output;
}
/**
 *
 * @requires {utilities/string/trim}
 *
 * @param {Array} template  -
 * @param {ArrayLike} expressions  -
 * @returns {string}
 */
export function singleLineString(template, ...expressions) {
	const templateString = tagTemplate(template, expressions);
	const lines = templateString.split(/(?:\r\n|\n|\r)/);

	return lines
		.map(line => trim(line))
		.join(' ')
		.trim();
}
/**
 *
 * @requires {utilities/string/trim}
 *
 * @param {Array} template  -
 * @param {ArrayLike} expressions  -
 * @returns {string}
 */
export function trimTag(template, ...expressions) {
	const templateString = tagTemplate(template, expressions);

	return trim(templateString);
}
/**
 *
 *
 * @param {Array} template -
 * @param {ArrayLike} expressions -
 * @returns {string}
 */
export function escapeHTML(template, ...expressions) {
	return template.reduce((accumulator, part, i) => {
		return (
			accumulator +
			expressions[i - COUNTER_STEP] +
			part
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
		);
	}, '');
}

/**
 * Метод ветвелния отображения шаблонов в зависимости от условия
 *
 * @param {boolean} condition  - условие проверки
 * @param {string} thenTemplate  - шаблон отображаемый в случае если условие верно
 * @param {string} elseTemplate  - шаблон отображаемый в случае если условие не верно
 * @returns {string}
 */
export function tagIf (condition, thenTemplate, elseTemplate = '') {
	return condition ? thenTemplate : elseTemplate;
}
