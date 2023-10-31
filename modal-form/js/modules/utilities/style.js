'use strict';
/** @module Util/style */

import { each } from './util';

export default {

	/**
	 * Метод возвращает текущие стили (конкретное свойство) для элемента
	 *
	 * @param {HTMLElement} element  Элемент для которого вычисляются стили
	 * @param {string} properties    Стилевое свойство которое необходимо узнать
	 * @returns {any}
	 */
	compute(element, properties) {
		const self = this;
		return self.get(element).getPropertyValue(properties);
	},

	/**
	 * Метод устанавливает стили для элемента
	 *
	 * @param {HTMLElement} element Элемент для которого устанавливаются стили
	 * @param {Object} styles       Объект свойств стилей которые надо выставить элементу
	 */
	set(element, styles) {
		const style = element.style;

		each(styles, (value, property) => {
			style[property] = value;
		});
	},

	/**
	 * Метод возвращает текущие стили (конкретное свойство) для элемента
	 *
	 * @param {HTMLElement} element Элемент для которого получаются стили
	 * @return {Array}
	 */
	get(element) {
		return window.getComputedStyle ?
			window.getComputedStyle(element, null) :
			element.currentStyle;
	},

	collectScrollPositions(element) {
		const parents = getParents({
			context: element
		});
		const list = parents.slice(1).map(function (element) {
			return {
				element,
				scrollTop: element.scrollTop,
				scrollLeft: element.scrollLeft,
			};
		});

		return function resetScrollPositions() {
			list.forEach(function (entry) {
				entry.element.scrollTop = entry.scrollTop;
				entry.element.scrollLeft = entry.scrollLeft;
			});
		};
	}
};
