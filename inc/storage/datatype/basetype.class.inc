<?php

namespace Storage\Datatype;

/**
 * Класс-родитель для типов данных
 *
 * @package livemaster
 * @author gstavirov
 * @date 30.08.2017
 */
class BaseType {

	/**
	 * Данные поумолчанию
	 * @var mixed
	 */
	protected $default = null;

	/**
	 * данные для обработки
	 * @var mixed
	 */
	protected $data = '';

	/**
	 * список фильтров
	 * @var array
	 */
	protected $filters = [];

	/**
	 * битовая маска с разрешениями для фильтров
	 * @var int
	 */
	protected $filtersOrders = 0; //

	/**
	 * Конструктор, принимает сырые данные, вызывает функцию-фильтр
	 * @param mixed $default данные, для наcтройки типа поумолчанию
	 * @param int $mask Битовая маска для фильтров
	 */

	public function __construct($default = null, $mask = 0) {
		$this->default = $default;
		$this->filtersOrders = $this->filtersOrders | $mask;
	}

	/**
	 * Метод для фильтрации данных(приводит данные к требуемому виду)
	 */
	private function filter() {
		$steps = count($this->filters);
		for ($i = 0; $i < $steps; $i++) {
			if (!($this->filtersOrders & (1 << $i))) {
				$method = $this->filters[$i];
				if (method_exists($this, $method)) {
					$this->data = $this->$method();
				}
			}
		}
	}

	/**
	 * Функция возвращает отформатированные данные
	 * @return mixed
	 */
	public function get() {
		return $this->data ?: $this->default;
	}

	/**
	 * Метод для установки данных, вызывает обработку
	 * @param mixed $data Данные для обработки
	 */
	public function set($data) {
		$this->data = $data ?: $this->default;
		$this->filter();
		return $this;
	}
}
