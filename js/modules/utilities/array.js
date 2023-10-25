/**
 * @module Util/array
 */

import { ZERO } from 'js/constants/common';

export default {
	/**
	 * Convert object to Array
	 * @param  {Object} obj
	 * @param  {Int} offset
	 * @return {Array}
	 */
	toArray(obj, offset) {
		offset = offset >= ZERO ? offset : ZERO;

		if (Array.from) {
			return Array.from(obj).slice(offset);
		}

		return slice.call(obj, offset);
	},

	/**
	 *
	 * @param  {All}   value
	 * @param  {Array} arr
	 * @return {Array}
	 */
	inArray(value, arr) {
		let index = -1;

		if (arr.indexOf) {
			return arr.indexOf(value);
		}

		arr.forEach((n, i) => {
			if (n === value) {
				index = i;
			}
		});

		return index;
	},
};
