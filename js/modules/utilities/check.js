/**
 * Copyright (c) 2017-present, Livemaster, LLC.
 *
 * @fileOverview Утилитные методы проверки.
 *
 * @module @lm/modules/utilities/check
 * @author Ilya Reshetnikov <ireshetnikov@livemaster.ru>
 * @author Dmitry Zakharov <dzaharov@livemaster.ru>
 * @version 0.4.2
 */

import store from 'store';
import { getClientData } from 'js/modules/utilities/data';
import { remove, removeClass } from 'js/modules/utilities/dom';
import { isString } from 'js/modules/utilities/type';
import { ZERO, ONE } from 'js/constants/common';

/**
 * Remove class `nojs` from body if js enabled.
 *
 * @example
 * import { jsEnable } from 'js/modules/utilities/check';
 * jsEnable();
 */
export function jsEnable() {
	const bodyElement = document.querySelector('.no-js');
	const noscript = document.querySelector('noscript');

	if (bodyElement) {
		removeClass(bodyElement, 'no-js');
	}

	if (noscript) {
		remove(noscript);
	}
}

/**
 * Проверка наличии авторизации
 *
 * @returns {boolean}
 */
export function isAuth() {
	const localeClientData = getClientData('#locale-client-data') || {userId: 0};
	return Boolean(localeClientData.userId);
}

/**
 * Проверка на то, что пользователь имеет email
 *
 * @returns {boolean}
 */
export function isUserHasEmail() {
	const { hasEmail = true } = getClientData('#locale-client-data');
	return hasEmail;
}

/**
 * Проверка на способ регистрации
 *
 * @returns {int}
 */
export function isRegByNumber() {
	const { regMethod = 1 } = getClientData('#locale-client-data');
	return regMethod;
}

/**
 * Проверка есть ли у пользователя привязанный номер телефона
 *
 * @returns {boolean}
 */
export function isHavePhoneNumber() {
	const { havePhoneNumber = false } = getClientData('#locale-client-data');
	return Boolean(havePhoneNumber);
}

/**
 * Определяет является ли пользователь мастером
 *
 * @returns {boolean}
 */
export function isMaster() {
	const localeClientData = getClientData('#locale-client-data') || {isMaster: false};
	return Boolean(localeClientData.isMaster);
}

/**
 * @returns {boolean}
 */
export const isLHM = () => Boolean(
	(getClientData('#locale-client-data') || { isLHM: false }).isLHM
);

/**
 * Проверка экосистемы языка ru+ua vs en+es
 *
 * @returns {boolean}
 */
export function isCom() {
	const localeClientData = getClientData('#locale-client-data') || {isCom: false};
	return Boolean(localeClientData.isCom);
}

/**
 * Проверка подтверждения email
 *
 * @returns {boolean}
 */
export function userEmailStatus() {
	const localeClientData = getClientData('#locale-client-data') || {userEmailStatus: false};
	return Boolean(localeClientData.userEmailStatus);
}

/**
 * Проверка нужно ли показывать 3-е окно Быстрого создания магазина
 *
 * @returns {boolean}
 */
export function showQuickCreateShopModal() {
	const localeClientData = getClientData('#locale-client-data') || {showQuickCreateShopModal: false};
	return Boolean(localeClientData.showQuickCreateShopModal);
}

/**
 *
 *
 * @returns {boolean}
 */
export function isBetaVersion() {
	const localeClientData = getClientData('#locale-client-data') || {betaversion: true};
	return Boolean(localeClientData.betaversion);
}

/**
 *
 *
 * @returns {boolean}
 */
export function isPageVacancy() {
	const localeClientData = getClientData('#locale-client-data') || {isVacancy: true};
	return Boolean(localeClientData.isVacancy);
}

/**
 *
 * @returns {boolean}
 */
export function showModalSex() {
	const {showModalSex = false} = getClientData('#locale-client-data');
	return Boolean(showModalSex);
}

/**
 *
 * @returns {boolean}
 */
export function isTalents() {
	const { isTalentsPage = false } = getClientData('#client-data');
	return Boolean(isTalentsPage);
}

/**
 * Определяет по строке userAgent является ли устройство мобильным.
 *
 * @param {string} userAgent  - собственный userAgent (navigator is default)
 * @returns {boolean}
 */
export function isMobile(userAgent = navigator.userAgent) {
	if (userAgent && !(isString(userAgent))) {
		throw new Error('[LM] Invalid param type. UserAgent must be string');
	}
	let isMobile = false;
	const ua = userAgent || navigator.userAgent;
	const MOBILE = [
		'iphone',
		'ipad',
		'android',
		'blackberry',
		'nokia',
		'opera mini',
		'windows mobile',
		'windows phone',
		'iemobile',
	];

	if (sessionStorage.desktop /* desktop storage */) {
		isMobile = false;
	} else if (localStorage.mobile /* mobile storage */) {
		isMobile = true;
	}

	for (const i in MOBILE) {
		if (ua.toLowerCase().indexOf(MOBILE[i].toLowerCase()) > ZERO) {
			isMobile = true;
		}
	}

	if (!isMobile) {
		isMobile = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
	}

	return isMobile;
}

export function isIOS() {
	const browser = navigator.userAgent || navigator.vendor || window.opera;

	return (
		(browser.indexOf('iPad') > ZERO) ||
		(browser.indexOf('iPhone') > ZERO) ||
		(browser.indexOf('iPod') > ZERO) ||
		(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
	);
}

export function isAndroid() {
	const browser = navigator.userAgent || navigator.vendor || window.opera;

	return (
		(browser.indexOf('Android') > ZERO)
	);
}

/**
 *
 */
export function isDesktop() {
	const FIX_DESKTOP_WIDTH = 976;
	return ($(window).width() > FIX_DESKTOP_WIDTH);
}

/**
 * Проверка есть ли у текущего мастера активная пробная карта.
 *
 * @returns {boolean}
 */
export function isActiveCardDemo() {
	const {isActiveCardDemo = false} = getClientData('#locale-client-data');
	return Boolean(isActiveCardDemo);
}

/**
 * Проверка является ли аккаунт текущего мастера пробным
 *
 * @returns {boolean}
 */
export function isMasterAccountTypeDemo() {
	const {isMasterAccountTypeDemo = false} = getClientData('#locale-client-data');
	return Boolean(isMasterAccountTypeDemo);
}

/**
 * Проверка нужно ли отображать банер о скором завершении демо аккаунта
 *
 * @returns {boolean}
 */
export function needShowRemindDemoServiceBanner() {
	const {demoServiceShowRemindBanner = false} = getClientData('#locale-client-data');
	return Boolean(demoServiceShowRemindBanner);
}

/**
 * Проверка является ли элемент не пустым jQuery объектом
 *
 * @param {Object} jqElem - jQuery object
 * @returns {boolean}
 */
export function isSafeJqElem(jqElem) {
	return jqElem && jqElem instanceof jQuery && jqElem.length;
}

/**
 * Метод проверяет признак открыт ли сейчас вьювер
 *
 * @returns {boolean}
 */
export function hasViewerOpen() {
	return window.hasViewerOpen || false;
}

/**
 * Определяет используется ли в данный момент IE
 *
 * @param {bool} getVersion - вернуть версию IE
 *
 * @returns {bool|number}
 */
export const isIE = (getVersion = false) => {
	const agent = navigator.userAgent;
	const msie = agent.indexOf('MSIE');

	let answer = 0;

	/* eslint-disable */
	if (msie > ZERO) {
		// old IE
		answer = parseInt(agent.substring(msie + 5, agent.indexOf('.', msie)), 10);
	} else if (agent.match(/Trident\/7\./)) {
		// IE 11
		answer = 11;
	}
	/* eslint-enable */

	return getVersion ? answer : Boolean(answer);
};

/**
 * Проверка является ли аккаунт текущего мастера пробным
 *
 * @returns {boolean}
 */
export function needShowWelcomeWindow() {
	const localeClientData = getClientData('#locale-client-data') || {showWelcomeWindow: false};
	return Boolean(localeClientData.showWelcomeWindow);
}

/**
 * Проверка редиректа на родительскую экосистему
 * 
 * @returns {boolean}
 */
export function isEcosystemRedirect() {
	const { ecosystemRedirect = false } = getClientData('#locale-client-data');
	return Boolean(ecosystemRedirect);
}

/**
 * Проверка редиректа на родительскую экосистему
 * 
 * @returns {string}
 */
export function getEcosystemRedirect() {
	const { ecosystemRedirectUrl = '/' } = getClientData('#locale-client-data');
	return ecosystemRedirectUrl;
}

/**
 * Проверяет является ли значение переменной функцией
 *
 * @param {Function} functionToCheck - переменная для проверки
 * @deprecated - использовать **lodash**-эквивалент
 */
export const isFunction = functionToCheck =>
	functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';

/**
 * Проверяет является ли значение переменной HTMLElement объектом
 *
 * @param {any} elem - значение для проверки
 * @deprecated - использовать **lodash**-эквивалент (isElement)
 */
export const isHTMLElement = elem => Boolean(
	typeof HTMLElement === 'object' ?
		elem instanceof HTMLElement : (
			elem
			&& typeof elem === 'object'
			&& elem !== null
			&& elem.nodeType === ONE
			&& typeof elem.nodeName === 'string'
		)
);

/**
 * Проверка на наличие boxberry у мастера
 *
 * @returns {boolean}
 */
export const isBoxberryConnected = () => {
	const { isBoxberryConnected = false } = getClientData('#locale-client-data');
	return Boolean(isBoxberryConnected);
};

/**
 * Проверка на наличие russianPost у мастера
 *
 * @returns {boolean}
 */
export const isOdsRussianPostConnected = () => {
	const { isOdsRussianPostConnected = false } = getClientData('#locale-client-data');
	return Boolean(isOdsRussianPostConnected);
};

/**
 * Проверка на то что почта России была хоть раз подключена
 *
 * @returns {boolean}
 */
export const isRussianPostWasConnected = () => {
	const russianPostWasLinked = store.get('russianpostWasConnected');
	return Boolean(russianPostWasLinked);
};

// NOT use default export
export default {
	jsEnable,
	isAuth,
	isMaster,
	isCom,
	isUserHasEmail,
	isRegByNumber,
	userEmailStatus,
	isBetaVersion,
	isPageVacancy,
	showModalSex,
	isMobile,
	isDesktop,
	showQuickCreateShopModal,
	isIOS,
	isAndroid,
	isHavePhoneNumber,
	isEcosystemRedirect,
	getEcosystemRedirect,
};
