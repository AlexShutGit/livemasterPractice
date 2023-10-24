<?php

namespace Controller;

use Provider\RedirectHelper;

/**
 * Класс базового контроллера паттерна MVC
 *
 * Все контроллеры должны наследоваться от него
 *
 * @package Controller
 */
class CommonController
{
	/** @var string Имя файла шаблона */
	private $template = '';
	/** @var array Массив данных, которые передаются в шаблон */
	protected $data = [];
	/** @var array Массив данных, который влияет на отображение страницы */
	protected $page = [];
	/** @var string Вызываемая функция контроллера */
	protected $action = '';
	/** @var string Относительная ссылка */
	protected $uri = '';

	/**
	 * Controller constructor.
	 *
	 * @param string $action Вызываемая функция контроллера
	 * @param string $uri Относительная ссылка
	 * @return void
	 */
	public function __construct(string $action, string $uri)
	{
		global $page;

		$this->action = $action;
		$this->uri = $uri;
		$this->page = $page;
		$this->page['action'] = $action;
		$this->page['uri'] = $uri;
		// Определям глобальные переменные для шаблона, их всегда можно переопределить в дочернем методе
		$this->data = [
			'page' => $this->page,
		];
	}

	/**
	 * Устанавливает имя шаблона.
	 *
	 * @param string $templateName Название шаблона
	 * @return void
	 */
	final public function setTemplate(string $templateName)
	{
		$this->template = preg_match('/^.*\.tpl$/u', $templateName) ? $templateName : $templateName . '.tpl';
	}

	/**
	 * Возвращает имя шаблона
	 *
	 * @return string
	 */
	final public function getTemplate(): string
	{
		return $this->template;
	}

	/**
	 * Рендерит шаблон
	 *
	 * @return string
	 */
	final public function render(): string
	{
		if (!$this->template) {
			return '';
		}

		global $twig;

		$Template = $twig->load($this->template);
		ob_start();
		$Template->display($this->data);

		return ob_get_clean();
	}

	/**
	 * Возвращает данные для шаблона
	 *
	 * @return array
	 */
	final public function getData(): array
	{
		return $this->data;
	}

	/**
	 * Возвращает строку в формате json
	 *
	 * @param mixed $value Преобразуемое значение
	 * @param bool $send Если true, то результат выводится сразу в браузер
	 * @param int $mask Битовая маска для функции json_encode
	 * @return string
	 */
	final public function toJSON($value, $send = false, $mask = 0): string
	{
		$result = json_encode($value, $mask) ?: '';

		if ($send) {
			print($result);
		}

		return $result;
	}

	/**
	 * Проверяет, послан ли запрос через AJAX
	 *
	 * @return bool
	 */
	final public function isAjax(): bool
	{
		return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
	}

	/**
	 * Переход на главную страницу, в случае если действие
	 * по умолчанию (т.е. фунгкция с именем index) не определено в
	 * классе потомке
	 *
	 * @return void
	 */
	public function index($params)
	{
		RedirectHelper::fastRedirect('/');
	}

	/**
	 * Показывает страницу с 404 ошибкой и возвращает код ответа HTTP 404 (аналог 404.php для контроллеров)
	 *
	 * @return void
	 */
	public static function showNotFoundPage()
	{
		header('HTTP/1.0 404 Not Found');

		require_once __DIR__ . '/twig-loader.inc';

		global $page, $twig;
		if (!is_array($page)) {
			$page = [];
		}
		$page['title'] = _('Вы попали на несуществующую страницу Ярмарки Мастеров');

		$T = $twig->load('/responsive/pages/404/index.tpl');
		$T->display([
			'page' => $page,
		]);
	}
}