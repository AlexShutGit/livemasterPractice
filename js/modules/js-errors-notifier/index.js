/**
 * Copyright (c) 2018-present, Livemaster, LLC.
 *
 * @fileOverview Send JS errors in Graylog
 *
 * @module core/js-errors-notifier
 * @author Dmitry Evtushenko <devtushenko@livemaster.ru>
 * @version 0.1.0
 */

import { INDEXOF_FAIL_CODE } from 'js/constants/common';

const EXCLUDED_ERRORS = [
	'FirebaseError',
	'Script error'
];

export default class JsErrorsNotifier {

	constructor(properties) {
		this.props = {};
		this.props.message = properties.message;
		this.props.url = properties.url;
		this.props.lineNo = properties.lineNo;
		this.props.columnNo = properties.columnNo;
		this.props.host = properties.host.replace('www.', '');
		this.props.protocol = properties.protocol;
		this.props.userId = properties.userId;
	}

	isExcludedErrors(message = '', errArr = []) {
		let isExit = false;

		errArr.forEach(err => {
			if (message.indexOf(err) !== INDEXOF_FAIL_CODE) {
				isExit = true;
			}
		});

		return isExit;
	}

	sendError() {
		if (this.isExcludedErrors(this.props.message, EXCLUDED_ERRORS)) {
			return;
		}

		const xhr = new XMLHttpRequest();
		xhr.open('POST', this.props.protocol + '//fecollector.' + this.props.host + '/js/', true);
		xhr.send([`JS Error: ${this.props.message} in ${this.props.url} on line ${this.props.lineNo} [column: ${this.props.columnNo}]. UserId: ${this.props.userId}`]);
	}
}
