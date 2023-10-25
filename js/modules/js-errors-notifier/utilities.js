import JsErrorsNotifier from './index';
import { getUserId } from 'js/modules/utilities/client-data';

export const notifierSendError = (message) => {
	const errorNotifier = new JsErrorsNotifier({
		message: message,
		url: window.location.href,
		lineNo: 0,
		columnNo: 0,
		host: window.location.host,
		protocol: window.location.protocol,
		userId: getUserId(),
	});
	errorNotifier.sendError();
};

export const getErrorMessage = (error) => {
	if (error && error.message && error.stack) {
		return `${error.message}. ${error.stack}`;
	}

	if (typeof error === 'object') {
		return JSON.stringify(error);
	}

	if (typeof error === 'string') {
		return error;
	}

	return '';
};