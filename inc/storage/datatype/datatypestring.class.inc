<?php

namespace Storage\Datatype;

use Provider\LmMysql;

/**
 * Класс реализующий тип данных String для фильтра данных
 *
 */
class DataTypeString extends BaseType
{
	/**
	 * Отключить вырезание тегов
	 */
	const NO_STRIP_TAGS = 1;

	/**
	 * Отключить экранирование символов
	 */
	const NO_SQL_SAFE = 2;

	/**
	 * Отключить вырезание строки 'javascript:'
	 */
	const NO_STRIP_JS_COLON = 3;

	public function __construct($default = null, $mask = 0) {
		parent::__construct($default !== null ? $default : '', $mask);
		//Массив в который записываем имена методов, которые выступят в роли проверок для данных
		$this->filters = [
			'stripTags',
			'sqlSafe',
			'stripJsColon',
		];
	}

	/**
	 * Вырезает все теги
	 *
	 * @return string
	 */
	public function stripTags(): string
	{
		$result = strip_tags($this->data);
		return $result ?: $this->default;
	}

	/**
	 * Защита от sql инъекций, экранирует спецсимволы
	 *
	 * @return string
	 */
	public function sqlSafe(): string
	{
		$result = lmMysql::getInstance()->realEscapeString($this->data);
		return $result ?: $this->default;
	}

	/**
	 * Вырезает строку 'javascript:'
	 *
	 * @return string
	 */
	public function stripJsColon(): string
	{
		$result = str_replace('javascript:', '', $this->data);
		return $result ?: $this->default;
	}
}