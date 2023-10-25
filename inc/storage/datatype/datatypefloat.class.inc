<?php

namespace Storage\Datatype;


/**
 * Класс реализующий тип данных Float для фильтра данных
 */
class DataTypeFloat extends BaseType
{
	/** Флаг изменения разделителя дробной части */
	const CHANGE_DELIMITER_POINT = 1;

	public function __construct($default = null, $mask = 0) {
		parent::__construct($default !== null  ? $default : 0, $mask);
		$this->filters = [
			'changeDelimiterPoint',
			'getFloat',
		];
	}

	/**
	 * Типизация под float
	 * @return float
	 */
	public function getFloat(): float
	{
		$result = (float) filter_var($this->data, FILTER_VALIDATE_FLOAT);
		return $result ?: $this->default;
	}

	/**
	 * Меняет разделитель "," на "."
	 * @return mixed
	 */
	public function changeDelimiterPoint()
	{
		return str_replace(',', '.', $this->data);
	}

}