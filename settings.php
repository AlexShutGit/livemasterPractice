<?php

if (!defined('PATH_SEPARATOR')) {
	define('PATH_SEPARATOR', getenv('COMSPEC') ? ';' : ':');
}
ini_set('include_path', ini_get('include_path').PATH_SEPARATOR.dirname(__FILE__));
define('ROOT_PATH', __DIR__."/"); // Путь к корню веб-сервера

define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_USER', 'praktikum');
define('DB_PASS', 'sh45Klvn69a');
define('DB_DEFAULT', 'praktikum');
define('DB_CHARSET_DEFAULT', 'utf8');
define('DB_WEIGHT', '1');

$host = preg_replace('/\..+$/', '', $_SERVER['HTTP_HOST']) . '.livemaster';