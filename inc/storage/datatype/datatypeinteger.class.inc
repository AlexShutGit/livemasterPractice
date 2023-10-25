<?php

namespace Storage\Datatype;

/**
 * Класс реализующий тип данных Integer для фильтра данных
 *
 */
class DataTypeInteger extends BaseType {

	public function __construct($default = null, $mask = 0) {
		parent::__construct($default !== null ? $default : 0, $mask);
		$this->filters = [
			'getInteger'
		];
	}

	/**
	 * Типизация под int
	 * @return int
	 */
	public function getInteger(): int
	{
		$result = (int) filter_var($this->data, FILTER_SANITIZE_NUMBER_INT);
		return $result ?: $this->default;
	}
}