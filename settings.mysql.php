<?php

/**
 * Файл настроек доступов к БД
 */

$dbConf = [];

$dbConf['default'] = [
	'master' => [
		'host'     => DB_HOST,
		'port'     => DB_PORT,
		'user'     => DB_USER,
		'password' => DB_PASS,
		'db'       => DB_DEFAULT,
		'charset'  => DB_CHARSET_DEFAULT
	],
	'slaves' => [
		0 => [
			'host'     => DB_HOST,
			'port'     => DB_PORT,
			'user'     => DB_USER,
			'password' => DB_PASS,
			'db'       => DB_DEFAULT,
			'charset'  => DB_CHARSET_DEFAULT,
			'weight'   => DB_WEIGHT
		]
	],
];