/**
 * Метод выдает ошибку в консоль, кидает исключение
 * на основе переданого текста или объекта ошибки
 *
 * @param {string|Object} err - строка или объект ошибки
 * @returns {Promise<any>}
 */
export const onPromiseError = err => {
	// Проверяем что пришллов качестве аргумента
	// объект ошибки или строка с описнаие ошибки
	const message = typeof err === 'object' ? err.message : err;
	// eslint-disable-next-line
	console.log(message);
	// Возврашаем причину отклонения promise-а
	return Promise.reject(typeof err === 'object' ? err : new Error(err));
};
