<?php

namespace Core;

use Provider\RedirectHelper;
use ReflectionClass;

/**
 * Класс роутинга
 *
 * @package Core
 */
class Router {

	private static $uriRegex = '/^\/(?\'controller\'\w*)(\/(?\'action\'\w*))?(?\'slashParams\'(\/[A-z0-9_-]*)*)?(?\'getParams\'\?([A-z0-9_-]+=[A-z0-9_-]*&?)*)?/um';

	/** @var string URL-адрес несуществующей страницы */
	private static $notFoundUrl = '/404';

	private static $defaultController = 'home';

	private static $defaultAction = 'index';

	/**
	 * Функция обработки запроса
	 */
	public static function handleRequest()
	{
		$requestUri = self::getRequestURI();
		$parameters = self::parseUri($requestUri);

		try {
			$controller = new ReflectionClass(self::buildControllerName($parameters['controller']));
			$method = $controller->getMethod($parameters['action']);
			$instance = $controller->newInstance($parameters['action'], $requestUri);

			$method->invoke($instance, $parameters['slashParams']);
		} catch (\Exception $exception) {
			trigger_error($exception->getMessage());
			RedirectHelper::fastRedirect(self::$notFoundUrl);
		}
	}

	/**
	 * Парсит URI запроса
	 *
	 * @param string $uri
	 * @return array
	 */
	private static function parseUri(string $uri): array
	{
		preg_match(self::$uriRegex, $uri, $matches);

		return [
			'controller' 	=> $matches['controller'] ?: self::$defaultController,
			'action' 		=> $matches['action'] ?: self::$defaultAction,
			'slashParams'	=> self::parseSlashParams($matches['slashParams'] ?? ''),
			'getParams'		=> self::parseGetParams($matches['getParams'] ?? ''),
		];
	}

	/**
	 * Функция парсит параметры через слэш
	 *
	 * @param string $paramString
	 * @return array
	 */
	private static function parseSlashParams(string $paramString): array
	{
		preg_match_all('/(\/(?\'param\'[A-z0-9_-]*))/u', $paramString, $matches);

		return array_filter($matches['param']);
	}

	/**
	 * Функция парсит Get параметры
	 *
	 * @param string $paramString
	 * @return array
	 */
	private static function parseGetParams(string $paramString): array
	{
		$paramRegex = '/(?\'name\'[A-Za-z0-9_-]+)=(?\'value\'[A-z0-9]*)/';
		preg_match_all($paramRegex, $paramString, $matches);
		$params = array_shift($matches) ?? [];
		return array_map(function ($param) use ($paramRegex) {
			preg_match($paramRegex, $param, $match);
			return [
				$match['name'] => $match['value']
			];
		}, $params);
	}

	/**
	 * Строит название класса контроллера
	 *
	 * @param string $controllerName - название контроллера
	 * @return string
	 */
	private static function buildControllerName(string $controllerName): string
	{
		return '\\Controller\\' .ucfirst($controllerName) . 'Controller';
	}

	/**
	 * Возвращает URI запроса
	 *
	 * @return string
	 */
	private static function getRequestURI(): string
	{
		return isset($_SERVER['REDIRECT_URL']) && $_SERVER['REDIRECT_URL'] !== $_SERVER['REQUEST_URI']
			? $_SERVER['REDIRECT_URL']
			: $_SERVER['REQUEST_URI'];
	}
}