<?php

// Устанавливаем внутреннюю UTF-8 кодировку  для скрипта
mb_internal_encoding('utf-8');
// Устанавливаем UTF-8 кодировку  для многобайтовых регулярных выражений
mb_regex_encoding('utf-8');

// Начинаем новую сессию, либо возобновляем существующую
session_start();

// Устанавливаем заголовок типа контента
header('Content-type: text/html; charset=utf-8');

$page = preg_replace("/.*(\/)/us", "", $_SERVER['SCRIPT_NAME']);