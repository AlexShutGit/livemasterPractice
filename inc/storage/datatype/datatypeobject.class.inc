<?php

namespace Storage\Datatype;

use stdClass;

/**
 * Класс реализующий тип данных Object для фильтра данных
 */
class DataTypeObject extends BaseType
{
	public function __construct($default = null, $mask = 0)
	{
		parent::__construct($default !== null ? $default : new stdClass(), $mask);
		$this->filters = [
			'getObject',
		];
	}

	/**
	 * Типизация под stdClass
	 *
	 * @return stdClass
	 */
	public function getObject(): stdClass
	{
		$result = json_decode($this->data);
		return $result ? $result : $this->default;
	}
}