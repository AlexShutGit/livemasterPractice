<?php

namespace Controller;

/**
 * Контроллер главной страницы
 *
 * @package Controller
 */
class HomeController extends CommonController
{
	public function __construct(string $action, string $uri)
	{
		parent::__construct($action, $uri);
	}

	/**
	 * Главная страница
	 *
	 * @param array $params Массив параметров
	 */
	public function index($params = [])
	{
		$this->setTemplate('pages/home/index.tpl');
		echo $this->render();
	}
}