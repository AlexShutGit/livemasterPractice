<?php

namespace Provider;

/**
 * Класс для разного рода редиректов
 */
class RedirectHelper
{
	/** Код - ресурс перемещен навсегда */
	const MOVED_PERMANENTLY = 'HTTP/1.1 301 Moved Permanently';

	/**
	 * Метод для быстрого редиректа по относительной ссылке, позволяет установить нужные заголовки перед редиректом
	 *
	 * @param string $location URL для редиректа
	 * @param bool $condition Условие по которому произойдет редирект
	 * @param array $addHeaders Массив заголовков для установки, строковый
	 * @return void
	 */
	public static function fastRedirect(string $location, bool $condition = true, array $addHeaders = [self::MOVED_PERMANENTLY])
	{
		if ($condition) {
			foreach($addHeaders as $header) {
				header($header);
			}

			header('Location: ' . $location);
			exit;
		}
	}
}