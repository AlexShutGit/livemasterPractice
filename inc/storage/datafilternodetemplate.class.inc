<?php

namespace Storage;

/**
 * Вспомогательный класс для описания шаблона датафильтра
 */
class DataFilterNodeTemplate {

	/** @var mixed Данные */
	public $data;

	/** @var mixed Шаблон */
	public $template;

	public function __construct($data, $template) {
		$this->data = $data;
		$this->template = $template;
	}
}
