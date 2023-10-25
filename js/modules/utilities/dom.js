/**
 * Copyright (c) 2017-present, Livemaster, LLC.
 *
 * @fileOverview Shared DOM methods.
 *
 * @module @lm/modules/utilities/dom
 * @author Ilya Reshetnikov <ireshetnikov@livemaster.ru>
 * @version 0.2.1
 */
import {onPromiseError} from 'js/modules/utilities/promise';
import isString from 'lodash-es/isString';
import isElement from 'lodash-es/isElement';
import TYPE from 'js/modules/utilities/type';
import ERROR from 'js/modules/utilities/error';

const exception = {
	isDescendant: {
		parent: 'Error detected. Параметр parent не является элементом дом дерева(DOMElement).',
		child: 'Error detected. Параметр parent не является элементом дом дерева(DOMElement).',
	},
	offset: {
		element: 'Error detected. Параметр element не является элементом дом дерева(DOMElement).',
	},
	toggleClass: {
		element: 'Error detected. Параметр element не является элементом дом дерева(DOMElement).',
		className: 'Error detected. Параметр className не является строкой(string).',
	},
	createFragment: {
		html: 'Error detected. Параметр html не является строкой(string)',
	},
};

/**
 * Insert element before child of elements
 *
 * @param {HTMLElement} element  - Элемент куда производим вставку
 * @param {HTMLElement} child  - Элемент который вставляем
 */
export function prependChild(element, child) {
	var first = element.firstChild;
	if (first) {
		return element.insertBefore(child, first);
	}
	return element.appendChild(child);
}

/**
 * Метод проверяет является ли 2 элемент дочерним по отношению к 1
 *
 * @example
 *
 * const parent = document.querySelector('.parent');
 * const child = document.querySelector('.parent');
 * const isDescendant = DOM.isDescendant(parent, child);
 * if (isDescendant) { <expression> }
 *
 * @param   {DOMElement} parent  - Элемент "родитель"
 * @param   {DOMElement} child  - Элемент "ребенок"
 * @returns {boolean}  - Ответ на вопрос: 'parent' родитель  'child'?
 */
export function isDescendant(parent, child) {
	ERROR.assert(!TYPE.isElement(parent), exception.offset.parent);
	ERROR.assert(!TYPE.isElement(child), exception.offset.child);

	let node = child.parentNode;

	while (node !== null) {
		if (node === parent) {
			return true;
		}
		node = node.parentNode;
	}

	return false;
}

/**
 * Метод возврашает смещение элемента относительно
 * верхнего и левого края страницы учитывая скролинг.
 *
 * @example
 *
 * const element = document.querySelector('.element');
 * const offset = DOM.offset(element);
 *
 * @param   {HTMLElement} element  - HTMLElement Для которого нужно определить смещение
 * @returns {Object}  - Объекст с праметрами смещения.
 */
export function offset(element) {
	ERROR.assert(!TYPE.isElement(element), exception.offset.element);

	const rect = element.getBoundingClientRect();

	return {
		top: rect.top + document.body.scrollTop,
		left: rect.left + document.body.scrollLeft,
	};
}

/**
 * Toggle Class.
 *
 * @example
 *
 * const block = document.querySelector('.block');
 * DOM.toggleClass(block, 'block--closed');
 *
 * @param {HTMLElement} element  - Элемент для которого переключается класс
 * @param {string} className  - Класс для "переключения"
 */
export function toggleClass(element, className) {
	if (!element || !className) {
		return;
	}

	if (element.classList) {
		element.classList.toggle(className);
	} else {
		const classes = element.className.split(' ');
		const existingIndex = classes.indexOf(className);
		const startIndex = 0;
		const STEP_INDEX = 1;

		if (existingIndex >= startIndex) {
			classes.splice(existingIndex, STEP_INDEX);
		} else {
			classes.push(className);
		}

		element.className = classes.join(' ');
	}
}

/**
 * Remove Class.
 *
 * @example
 *
 * const block = document.querySelector('.block');
 * DOM.removeClass(block, 'block--hide');
 *
 * @param {HTMLElement} element  - Элемент для которого переключается класс
 * @param {string} className  - Класс для удаления.
 */
export function removeClass(element, className) {
	if (!element || !className) {
		return;
	}

	if (element.classList) {
		element.classList.remove(className);
	} else {
		const classes = element.className.split(' ');
		const existingIndex = classes.indexOf(className);
		const newIndex = 1;

		classes.splice(existingIndex, newIndex);

		element.className = classes.join(' ');
	}
}

/**
 * Remove elements from DOM (with polyfill)
 *
 * @example
 * const block = document.querySelector('.block');
 * DOM.remove(block);
 *
 * @param {HTMLElement} element  - Элемент который будет удален.
 */
export function remove(element) {
	/*
	 * polyfill for ie9+ NODE.remove()
	 * from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
	 */
	(function(arr) {
		arr.forEach(function(item) {
			if (item.hasOwnProperty('remove')) {
				return;
			}
			Object.defineProperty(item, 'remove', {
				configurable: true,
				enumerable: true,
				writable: true,
				value: function remove() {
					this.parentNode.removeChild(this);
				},
			});
		});
	}([Element.prototype, CharacterData.prototype, DocumentType.prototype]));

	element.remove();
}

/**
 * Replace elements from DOM (with polyfill)
 *
 * @param {HTMLElement} oldElem  - Элемент который будет заменен.
 * @param {HTMLElement} newElem  - Элемент который заменит.
 */
export const replaceWith = (oldElem, newElem) => {
	function ReplaceWithPolyfill() {
		'use-strict'; // For safari, and IE > 10
		const parent = this.parentNode;
		let i = arguments.length, currentNode;
		if (!parent) {
			return;
		}
		if (!i) {// if there are no arguments
			parent.removeChild(this);
		}
		while (i--) { // i-- decrements i and returns the value of i before the decrement
			currentNode = arguments[i];
			if (typeof currentNode !== 'object'){
				currentNode = this.ownerDocument.createTextNode(currentNode);
			} else if (currentNode.parentNode){
				currentNode.parentNode.removeChild(currentNode);
			}
			// the value of "i" below is after the decrement
			if (!i) {// if currentNode is the first argument (currentNode === arguments[0])
				parent.replaceChild(currentNode, this);
			} else {// if currentNode isn't the first
				parent.insertBefore(currentNode, this.previousSibling);
			}
		}
	}

	if (!Element.prototype.replaceWith) {
		Element.prototype.replaceWith = ReplaceWithPolyfill;
	}

	oldElem.replaceWith(newElem);
};

/**
 * Возврашает DocumentFragment заполненый переданным html.
 * Для добавления шаблонов на страницу.
 *
 * @example
 *
 * const html  = '<div>' + someText + '</div>';
 * const template = DOM.createFragment(template);
 * document.querySelector('body').appendChild(template);
 *
 * @param   {string} html  - Тело шаблона
 * @returns {DocumentFragment}
 */
export function createFragment(html) {
	const frag = document.createDocumentFragment();
	const temp = document.createElement('div');

	temp.innerHTML = html;
	while (temp.firstChild) {
		frag.appendChild(temp.firstChild);
	}
	return frag;
}

/**
 * Метод заменяет элемент(включая всех детей) новым элементом.
 *
 * @example
 * DOM.replaceElement(existElem, newElem);
 *
 * @param {HTMLElement} $element  - Существующий DOM предназначеный для замены.
 * @param {HTMLElement} $newElement  - Элемент DOM, который заменяет существующий DOM элемент.
 * @returns {HTMLElement}
 */
export function replaceElement($element, $newElement) {
	$element.parentNode.replaceChild($newElement, $element);
	return $newElement;
}

/**
 * Выбирает элементы из DOM с помощью селектора классов или
 * селектора идентификаторов.
 *
 * @deprecated используйте нативное element.querySelectorAll('')
 * @name select
 * @param {string} selector - Селектор для поиска по DOM.
 * @param {Document|HTMLElement?} context - Контекст для определения
 *     области поиска элемента. Если контекст не определн то он будет
 *     равен window.document
 * @returns {HTMLElement|[]} - Массив узлов DOM или пустой массив.
 */
export function select(selector, context) {
	if (!TYPE.isString(selector)) {
		return [];
	}

	const safeContext = !context || !TYPE.isElement(context) ? window.document : context;
	const selection = safeContext.querySelectorAll(selector);

	return Array.prototype.slice.call(selection);
}

/**
 * Remove all child elements
 *
 * @param {HTMLElement}  $element  - e
 */
export function removeChild($element) {
	while ($element.firstChild) {
		$element.removeChild($element.firstChild);
	}
	return $element;
}

/**
 * Поиск ближайший родительский элемент (или сам элемент),
 * который соответствует заданному CSS-селектору или null
 *
 * @example
 * import { closest } from 'js/modules/utilities/dom';
 * $(document).on('click', 'selector', (event) => {
 * 		console.log(closest(event.target, 'selector')); // ->
 * 		// -> выведет элемент на который был навешан обработчик.
 * })
 *
 * @author Ilya Reshetnikov <ireshetnikov@livemaster.ru>
 *
 * @param {HTMLElement} $element  - rsg
 * @param {string} selector  - css selector для поиска
 * @returns {HTMLElement|null}
 */
export function closest ($element, selector) {
	/* eslint-disable no-else-return */
	$element.matches = $element.matches || $element.mozMatchesSelector || $element.msMatchesSelector || $element.oMatchesSelector || $element.webkitMatchesSelector;
	if (!$element) {
		return null;
	} else if ($element.matches(selector)) {
		return $element;
	} else if (!$element.parentElement) {
		return null;
	} else {
		return closest($element.parentElement, selector);
	}
	/* eslint-disable no-else-return */
}

/**
 * Метод для редеринга шаблона, HTMLElement в контейнер
 *
 * @param {(HTMLElement|string)} template  - шаблона или HTMLElement для рендеринга
 * @param {string} [selector]  - селектор котейнера
 * @param {string} [container]  - селектор котейнера
 * @returns {?HTMLElement}
 */
export const renderContainerContents = ({
	template,
	selector,
	container,
}) => {
	return Promise.resolve()
		// Находим контейнер для вставки
		.then(() => {
			if (selector) {
				return document.querySelector(selector);
			} else if (container) {
				return container;
			}
		})
		.then(elem => {
			// Проверяем контейнер на существование
			if (!elem && !container) {
				return Promise.reject(
					new Error('LM - renderСontainerСontents: Контейнер или селектор указан не корректно')
				);
			}

			// Проверяем тип содержимое шаблона
			if (!isString(template) && !isElement(template)) {
				return Promise.reject(
					new Error('LM - renderСontainerСontents: Некорректный идентификатор комментария')
				);
			}
			return elem;
		})
		// Удаляем предидущее состояние
		.then(removeChild)
		// Формируем HTMLElements для вставки в контейнер
		.then(elem => ({
			container: elem,
			templateElement: isString(template) ? createFragment(template) : template,
		}))
		// Добавляем элемент как дочерний
		.then(({container, templateElement}) => {
			container.appendChild(templateElement);
			return container;
		})
		.catch(onPromiseError);
};

/*
 * Проверяет есть ли у элемента класс с заданным именем
 *
 * @author Dmitry Zakharov <dzaharov@livemaster.ru>
 *
 * @param {HTMLElement} element - Элемент для которого нужно проверить присутствие класса
 * @param {string} className - Имя класса для поиска
 * @returns {boolean}
 */
export const hasClass = (element, className) =>
	element.className && new RegExp(`(\\s|^)${className}(\\s|$)`).test(element.className);

/*
 * Возвращает элемент.
 * Можно использовать, когда заведомо неизвестно селектор элемента передан или сам элемент.
 *
 * @param {HTMLElement|string} elem - элемент или селектор элемента.
 * @returns {HTMLElement|null}
 */
export const getElem = (elem) => {
	if (isElement(elem)) {
		return elem;
	}
	return isString(elem) ? document.querySelector(elem) : null;
};

export default {
	createFragment,
	isDescendant,
	offset,
	prependChild,
	remove,
	removeClass,
	replaceElement,
	toggleClass,
	removeChild,
};
