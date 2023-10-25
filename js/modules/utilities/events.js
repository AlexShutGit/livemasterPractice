/** @module Util/events */

import { each, trim } from './util';
import { REGEXP_SPACES } from './constant';
import { TYPE } from './index';
import { ZERO, INDEXOF_FAIL_CODE } from 'js/constants/common';

export default {

	/**
	 * Метод для добавления обработчика событий DOM элементу.
	 *
	 * @param {any}      element       - Элемент на который необходимо повесить событие
	 * @param {string}   type          - Тип навешиваемого события
	 * @param {o}        handler       - Метод выполняемы в случае срабатывания события
	 * @param {boolean}  [once=false]  - Флаг определяющий выполнится событие один раз или нет.
	 *
	 * @example Events.addListener(
	 * 				doqument.querySellector('.elements'),
	 * 				'click',
	 * 				handler,
	 * 				true
	 * 			)
	 */
	addListener(element, type, handler, once = false) {
		const types = trim(type).split(REGEXP_SPACES);
		const originalHandler = handler;

		if (types.length > 1) {
			each(types, (t) => {
				addListener(element, t, handler);
			});
			return;
		}

		if (once) {
			handler = (...args) => {
				removeListener(element, type, handler);

				return originalHandler.apply(element, args);
			};
		}

		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent(`on${type}`, handler);
		}
	},

	/**
	 * Метод для удаления обработчиков событий
	 *
	 * @param  {DOMString} element - Элемент для которого необходимо удалить обработчик событий
	 * @param  {string} type       - тип события которое будет удалено
	 * @param  {Function} handler  - Метод выполняемы после удаления события
	 * @returns {Void}
	 */
	removeListener(element, type, handler) {
		const types = trim(type).split(REGEXP_SPACES);

		if (types.length > 1) {
			each(types, (t) => {
				removeListener(element, t, handler);
			});
			return;
		}

		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
			element.detachEvent(`on${type}`, handler);
		}
	},

	/**
	 * getEvent description
	 *
	 * @param  {string} event - Имя события
	 * @returns {Event}
	 */
	getEvent(event) {
		const e = event || window.event;

		// Fix target property (IE8)
		if (!e.target) {
			e.target = e.srcElement || document;
		}

		if (!isNumber(e.pageX) && isNumber(e.clientX)) {
			const eventDoc = event.target.ownerDocument || document;
			const doc = eventDoc.documentElement;
			const body = eventDoc.body;

			e.pageX = e.clientX + (
				((doc && doc.scrollLeft) || (body && body.scrollLeft) || ZERO) -
				((doc && doc.clientLeft) || (body && body.clientLeft) || ZERO)
			);
			e.pageY = e.clientY + (
				((doc && doc.scrollTop) || (body && body.scrollTop) || ZERO) -
				((doc && doc.clientTop) || (body && body.clientTop) || ZERO)
			);
		}

		return e;
	},

	/**
	 * Метод для создания собственного обработчика события и добавления его в в общую систему событий
	 *
	 * @param  {DOMString} element - Элемент на который навешивается событие
	 * @param  {string}    type    - Тип события
	 * @param  {string}    data    - Данные для создания собственного события
	 * @returns {Event|Bolean}
	 */
	dispatchEvent(element, type, data) {
		if (element.dispatchEvent) {
			let event;

			// Event and CustomEvent on IE9-11 are global objects, not constructors
			if (TYPE.isFunction(Event) && TYPE.isFunction(CustomEvent)) {
				if (TYPE.isUndefined(data)) {
					event = new Event(type, {
						bubbles: true,
						cancelable: true,
					});
				} else {
					event = new CustomEvent(type, {
						detail: data,
						bubbles: true,
						cancelable: true,
					});

				}
			} else if (TYPE.isUndefined(data)) {
				event = document.createEvent('Event');
				event.initEvent(type, true, true);
			} else {
				event = document.createEvent('CustomEvent');
				event.initCustomEvent(type, true, true, data);
			}

			// IE9+
			return element.dispatchEvent(event);
		} else if (element.fireEvent) {
			// IE6-10 (native events only)
			return element.fireEvent(`on${type}`);
		}

		return true;
	},

	/**
	 * Метод для добавления обработчика событий DOM элементу,
	 * который сработает один раз а потом удалится
	 *
	 * @param {any} element   - Элемент на который надо повесить событие
	 * @param {any} type      - Тип добавляемого события
	 * @param {any} callback  - Callback
	 */
	once(elementel, type, callback) {
		const self = this;
		const once = true;
		self.addListener(element, type, callback, once);
	},

	/**
	 * Алиас для Event.addListener
	 *
	 * @param {any} element   - Элемент на который надо повесить событие
	 * @param {any} type      - Тип добавляемого события
	 * @param {any} callback  - Callback
	 */
	on() {
		this.addListener.apply(this, arguments);
	},

	/**
	 * Алиас для Event.removeListener
	 *
	 * @param {any} el        - Элемент на котором висит событие
	 * @param {any} type      - Тип удаляемого события
	 * @param {any} callback  - Callback
	 *
	 * @see {removeListener}
	 */
	off() {
		this.removeListener.apply(this, arguments);
	},

	/**
	 * Алиас для Event.addListener
	 *
	 * @param {any} element   - Элемент на который надо повесить событие
	 * @param {any} type      - Тип добавляемого события
	 * @param {any} callback  - Callback
	 */
	subscribe() {
		this.addListener.apply(this, arguments);
	},

	/**
	 * Проверка вызвано событие клавиатурой
	 *
	 * @param {string} event - Событие
	 * @returns {boolean}
	 */
	isKeyboard(event) {
		return [
			'keydown',
			'keypress',
			'keyup',
		].indexOf(event.type) !== INDEXOF_FAIL_CODE;
	},

	ready(fn) {
		if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

};
