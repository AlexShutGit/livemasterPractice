import { ZERO } from 'js/constants/common';
import { getClientData } from 'js/modules/utilities/data';

// global | important
let globalLocaleClientData;

/** Получить instance локальных клиентских данных */
export const localeClientDataInstance = () => {
	globalLocaleClientData = globalLocaleClientData || getClientData('#locale-client-data') || {};
	return globalLocaleClientData;
};

/**
 * Проверка наличии авторизации
 *
 * @returns {boolean}
 */
export function getUserId() {
	return getClientData('#locale-client-data').userId || ZERO;
}
