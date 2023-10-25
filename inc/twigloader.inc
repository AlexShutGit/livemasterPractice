<?php

/**
 * Файл конфигурации расширения Twig
 */

require_once(__DIR__ . '/../settings.php');
require_once __DIR__ . '/../vendor/autoload.php';
require_once(__DIR__ . '/../lib/twig/htmLawed.php');
require_once(__DIR__ . '/../lib/twig/asset.php');

$twigLoader = new \Twig\Loader\FilesystemLoader(ROOT_PATH . 'tpl');

$twig = new \Twig\Environment($twigLoader, [
	'cache' => false, // php 74 moment
	'charset' => 'utf-8',
	'auto_reload' => true,
	'autoescape' => false
]);

//Регистрируем расширение webpackAsset
$twig->addExtension(new TwigExtensionWebpackAsset('dist', false));

$filter = new \Twig\TwigFilter('decode_entities', function ($string) {
	return html_entity_decode($string, ENT_QUOTES);
});

$twig->addFilter($filter);

$filter = new \Twig\TwigFilter('htmlawed', function ($string) {
	$twigHtmLawedConfig = [
		'elements' => 'span,p,a,b,strong,h2,h3,h4,ol,ul,li,br',
		'deny_attribute' => 'class,on*,id,script'
	];
	$string = htmLawed($string, $twigHtmLawedConfig);

	return $string;
});

$twig->addFilter($filter);
