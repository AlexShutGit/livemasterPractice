/**
 * Полифиллы нужны для добавления в старые браузеры поддержки возможностей,
 * которые в современных браузерах являются встроенными.
 *
 *
 * Copyright (c) 2017-present, Livemaster, LLC.
 */

import './polyfills/dom';

/* Будет использоваться встроенная в браузер реализация,
если она присутствует и не возврашает  ошибкой. */
Object.assign = require('object-assign');

/** Полифил для ES6 Promise */
import 'core-js/modules/es6.promise';

/** Полифил для Array.prototype.iterator (нужен для динамического импорта) */
import 'core-js/modules/es6.array.iterator';

/** Полифилы импортируемые динамически ([IntersectionObserver]) **/
import './polyfills/parts-dinamic-import';

/**
 * Полифил для подсчета количества ключей в объекте
 *
 * @deprecated Использовать Object,keys(obj).length
 * @param {Object} obj - Объект, у которого требуется подсчитать кол-во ключей
 * @returns {number}
 */
Object.size = function (obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			size++;
		}
	}
	return size;
};

/**
 * Полифил для старых браузеров
 */
/* eslint-disable no-extend-native */
/* eslint-disable no-param-reassign */
/* eslint-disable no-magic-numbers */
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (searchStr, Position) {
		// This works much better than >= because
		// it compensates for NaN:
		if (!(Position < this.length)) {
			Position = this.length;
		} else {
			Position |= 0; // round position
		}
		return this.substr(Position - searchStr.length, searchStr.length) === searchStr;
	};
}
/* eslint-enable no-extend-native */
/* eslint-enable no-param-reassign */
/* eslint-enable no-magic-numbers */

// Полифил для использования Number.isFinite (в основном для IE)
if (typeof Number.isFinite !== 'function') {
	Number.isFinite = function isFinite(value) {
		// If Type(number) is not Number, return false.
		if (typeof value !== 'number') {
			return false;
		}

		// If number is NaN, +∞, or −∞, return false.
		/* eslint-disable no-self-compare */
		if (value !== value || value === Infinity || value === -Infinity) {
			return false;
		}
		/* eslint-enable no-self-compare */

		return true;
	};
}

/**
 * Полифил для использования в IE/Safari, мобильных и старых браузерах проверки isInteger
 */
/* eslint-disable no-magic-numbers */
Number.isInteger = Number.isInteger || function(value) {
	return typeof value === 'number'
		&& Number.isFinite(value)
		&& !(value % 1);
};
/* eslint-enable no-magic-numbers */

if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

/**
 * Полифилл для Element.closest (IE9+)
 */
/* eslint-disable no-magic-numbers */
if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) {
			return null;
		}
		do {
			if (el.matches(s)) {
				return el;
			}
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}
/* eslint-enable no-magic-numbers */

if (!Math.trunc) {
	Math.trunc = function(v) {
		v = +v;
		if (!isFinite(v)) {
			return v;
		}
		return (v - v % 1) || (v < 0 ? -0 : v === 0 ? v : 0);
	};
}

