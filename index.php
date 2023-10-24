<?php

use Core\Router;

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/settings.php';
require_once __DIR__ . '/inc/lmautoloader.class.inc';
require_once  __DIR__ . '/inc/twigloader.inc';

/**
 * Регистрируем автозагрузчик классов
 *
 * Он автоматически подключает используемые файлы (не надо делать include, require и т.д)
 */
LmAutoloader::register();

/**
 * Обрабатываем запрос через роутер
 */
Router::handleRequest();