export const isAndroid = () => /Android/.test(navigator.userAgent);

export const isIOS = () => /iP(?:ad|hone|od)/.test(navigator.userAgent);

/**
 * Detect browser engine
 * @module Util/browser
 */
export default {

	/**
	 * Проверка что код выполняется в браузере.
	 *
	 * @example
	 *
	 * if (TYPE.isBrowser()) {
	 *    // some code.
	 * }
	 *
	 * @returns {boolean} - True если в браузере.
	 */
	isBrowser() {
		return (
			typeof window === 'object' && window instanceof Window &&
			typeof document === 'object' && document instanceof Document
		);
	},

	/**
	 *
	 *
	 * @returns {boolean}
	 */
	isAndroid(){
		return (/Android/.test(navigator.userAgent));
	},

	/**
	 *
	 *
	 * @returns {boolean}
	 */
	isIOS(){
		return (/iP(?:ad|hone|od)/.test(navigator.userAgent));
	},

	/**
	 *
	 *
	 * @returns {boolean}
	 */
	isMac(){
		return (/Mac OS X/.test(navigator.userAgent));
	},

	/**
	 *
	 *
	 * @returns {boolean}
	 */
	isWin(){
		return (/Windows NT/.test(navigator.userAgent));
	},


	/**
	 *
	 *
	 * @returns {boolean}
	 */
	isGecko(){
		return (/Gecko\//.test(navigator.userAgent));
	},

	/**
	 *
	 *
	 * @returns {boolean}
	 */
	isIElt11(){
		return (/Trident\/[456]\./.test(navigator.userAgent));
	},

	/**
	 *
	 *
	 * @returns {boolean}
	 */
	isPresto(){
		return (Boolean(!window.opera));
	},

	/**
	 *
	 *
	 * @returns {boolean}
	 */
	isEdge(){
		return (/Edge\//.test(navigator.userAgent));
	},

	/**
	 *
	 *
	 * @returns {boolean}
	 */
	isWebKit() {
		const self = this;
		return (!self.isEdge && /WebKit\//.test(navigator.userAgent));
	},

	/**
	 *
	 *
	 * @returns {boolean}
	 */
	isIE(){
		return (/Trident\/[4567]\./.test(navigator.userAgent));
	},
};

