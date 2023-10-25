'use strict';

/**
 * Максимальная ширина экрана для мобильного телефона
 * 
 * @export constant
 * @type {number}
 */
export const DEVICE_WIDTH_PHONE = 768;

/**
 * Максимальная ширина экрана для планшета
 * 
 * @export constant
 * @type {number}
 */
export const DEVICE_WIDTH_TABLET = 992;

/**
 * Максимальная ширина экрана для настолького компьютера
 * 
 * @export constant
 * @type {number}
 */
export const DEVICE_WIDTH_DESKTOP = 1280;

/**
 * [REGEXP_SPACES regexp for finde space]
 * @export constant
 * @type {String}
 */
export const REGEXP_SPACES = '/\s+/';
/**
 * REGEXP_TRIM RegExp for trim whitespaces
 * @export constant
 * @type {String}
 */
export const REGEXP_TRIM = '/^\s+(.*)\s+$/';
/**
 * RegExp for validate image url
 * @export constant
 * @type {String}
 */
export const REGEXP_IMAGE_URL = '/^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|jpeg|gif|png|svg)$/';

/**
 * RegExp for hypeneted string
 * @export constant
 * @type {String}
 */
export const REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;

/** Размер шрифта: базовый */
export const FONT_SIZE_BASE = 16;

/**
 * RegExp from RFC 5322
 * @see http://www.ietf.org/rfc/rfc5322.txt
 * @type {RegExp}
 */
export const REGEXP_EMAIL_RFC5322 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * RegExp used in type=”email” from W3C
 * @see https://www.w3.org/TR/html5/forms.html#e-mail-state-(type=email)
 * @type {RegExp}
 */
export const REGEXP_EMAIL_HTML5 = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/**
 * Standart Legacy Livemaster mail validate RegExp
 * @type {RegExp}
 */
export const REGEXP_EMAIL_LEGACY = /[0-9a-z_-]+@[0-9a-z_^.-]+\\.[a-z]{2,4}/;

/**
 * RegExp for iri Livemaster
 * @type {RegExp}
 */
export const REGEXP_URI = /^([a-z0-9+.-]+):(?:\/\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i;
