/**
 * Модуль, использующий шаблон Publisher/Subscriber.
 * Позволяет создавать модули, которые могут взаимодействовать друг с другом без прямой зависимости друг от друга.
 *
 * @example
 * ```
 *   // подписаться на событие 'sendMessage'
 *   publisherSubscriber.subscribe('sendMessage', data => RealtimeDialog.websocketData(data));
 *   ...
 *   // Вызвать все ф-ии привязанные к событию 'sendMessage'
 *   publisherSubscriber.publish('sendMessage', data)
 * ```
 *
 * @author Stanislav Merenkov <smerenkov@livemaster.ru>
 * @version 0.1.0
 */

const publisherSubscriber = {
	channels: {},
	subscribe(channelName, listener) {
		if (!this.channels[channelName]) {
			this.channels[channelName] = [];
		}
		this.channels[channelName].push(listener);
	},

	publish(channelName, data) {
		const channel = this.channels[channelName];
		if (!channel || !channel.length) {
			return;
		}

		channel.forEach(listener => listener(data));
	}
};

export default publisherSubscriber;