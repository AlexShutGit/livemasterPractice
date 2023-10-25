/**
 * Copyright (c) 2018-present, Livemaster, LLC.
 *
 * @fileOverview Utils для работы с Selection; window.getSelection() или document.getSelection()
 *
 * @author Dmitry Zakharov <dzaharov@livemaster.ru>
 * @version 1.0.0
 */

import { ZERO } from 'js/constants/common';

/**
 * Получить выделенный текст
 */
export const getSelectedText = () =>
	document.getSelection ? document.getSelection().toString() : '';

/**
 * Заменить выделенный текст контентом (node)
 * Можно передать document.createTextNode(text) - для вставки текста
 *
 * @param {Node|Fragment} node - node для подстановк
 */
export const replaceSelectedText = node => {
	if (!document.getSelection) {
		return;
	}

	const selection = document.getSelection();

	if (selection.rangeCount) {
		const range = selection.getRangeAt(ZERO);
		range.deleteContents();
		range.insertNode(node);
	}
};

/**
 * Получить текущий выделенный контент
 *
 * @returns {Range}
 */
export const saveSelection = () => {
	if (document.getSelection) {
		const sel = document.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			return sel.getRangeAt(ZERO);
		}
	} else if (document.selection && document.selection.createRange) {
		return document.selection.createRange();
	}

	return null;
};

/**
 * Выделить переданный контент
 *
 * @param {Range} range - выделенный прежде контент
 */
export const restoreSelection = range => {
	if (range) {
		if (document.getSelection) {
			const sel = document.getSelection();

			sel.removeAllRanges();
			sel.addRange(range);
		} else if (document.selection && range.select) {
			range.select();
		}
	}
};

/**
 * Убрать выделение контента
 */
export const clearSelection = () => {
	if (document.getSelection) {
		const sel = document.getSelection();

		if (sel.empty) {
			sel.empty();
		} else if (sel.removeAllRanges) {
			sel.removeAllRanges();
		}
	} else if (document.selection) {
		document.selection.empty();
	}
};
