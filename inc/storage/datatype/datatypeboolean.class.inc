<?php

namespace Storage\Datatype;

/**
 * Класс реализующий тип данных Boolean для фильтра данных
 */
class DataTypeBoolean extends BaseType
{
	public function __construct($default = null, $mask = 0) {
		parent::__construct($default !== null ? $default : false, $mask);
		$this->filters = [
			'getBoolean'
		];
	}

	/**
	 * Возвращает "Чистые" Boolean данные
	 *
	 * @return bool
	 */
	public function getBoolean(): bool
	{
		return (bool) filter_var($this->data, FILTER_VALIDATE_BOOLEAN);
	}

}