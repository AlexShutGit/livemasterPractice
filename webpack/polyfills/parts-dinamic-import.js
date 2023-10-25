import { notifierSendError, getErrorMessage } from 'js/modules/js-errors-notifier/utilities';

/** Полифил для поддержки IntersectionObserver */
if (!('IntersectionObserver' in window)) {
	import(
		/* webpackChunkName: "IObserver" */
		'intersection-observer'
	)
		.catch(err =>
			notifierSendError(`Fail dinamic import IntersectionObserver. Error: ${getErrorMessage(err)}`)
		);
}
