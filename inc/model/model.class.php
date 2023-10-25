<?php

namespace Model;

use Provider\LmMysql;

/**
 * Базовый класс модели паттерна MVC
 *
 * Все модели должны наследоваться от этого класса
 *
 * @package Model
 */
class Model
{

	public function __construct() {}

	/**
	 * Возвращает объект lmMysql для работы с БД
	 *
	 * @return LmMysql
	 */
	protected static function _db(): LmMysql
	{
		return LmMysql::getInstance();
	}
}