export const MILLISECONDS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
export const MINUTE_IN_HOURS = 60;
export const HOURS_IN_DAYS = 24;

export const MILISCONDS_IN_MINUTES = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE;
export const MILISCONDS_IN_HOURS = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTE_IN_HOURS;
export const MILISCONDS_IN_DAYS = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTE_IN_HOURS * HOURS_IN_DAYS;

/**
 * Функция преобразует дату в строковое представление формата - 1 января|1 января 2031 г.
 *
 * @param {umber|string} date - значение для создания экземпляра объекта Date.
 * @param {Object} props - парамметры для строкового представления.
 *
 * @returns {string}
 */
export const formatToLocaleDateString = (date, props = {}) => {
	const dateObj = new Date(date);
	const needYear = dateObj.getFullYear() !== (new Date()).getFullYear();

	return dateObj.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		...(needYear ? { year: 'numeric' } : {}),
		...props,
	});
};

/**
 * Функция конвертирования миллисекунд в минуты/часы/дни
 *
 * @param {number} milliseconds - количество миллисекунд
 * @param {string} to - ключ, указывающий во что стоит конвертировать
 *
 * @returns {number}
 */
export const convertMillsecondsTo = (milliseconds, to) => {
	switch (to) {
		case 'minute':
			return milliseconds / MILISCONDS_IN_MINUTES;

		case 'hour':
			return milliseconds / MILISCONDS_IN_HOURS;

		case 'day':
			return milliseconds / MILISCONDS_IN_DAYS;

		default:
			return milliseconds;
	}
};
