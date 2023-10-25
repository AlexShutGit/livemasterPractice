<?php
/**
 * Файл с функциями из класса stingUtils
 * Используется только для библиотек, чтобы избежать проблем с автолоадером библиотек
 *
 * @author Mikhail Estrin
 * @version 1.0, 16.08.2018
 */

/**
 * Аналог strtr для работы с мультибайтовыми кодировками из класса stingUtils
 *
 * @author ?, Mikhail Estrin
 * @version 1.0, 16.08.2018
 *
 * @param $str Входящая строка
 * @param $map Строка (string), заменяющая строку from
 * @param $enc Необязательный параметр, указывающий кодировку
 * @return string Строка с замененными символами
 */
function mb_strtr($str, $map, $enc = 'utf-8') {
	$out = '';
	$charArray = preg_split('/(?<!^)(?!$)/u', $str, -1, PREG_SPLIT_NO_EMPTY);
	$strLn = mb_strlen($str, $enc);
	$maxKeyLn = 1;
	foreach ($map as $key => $val) {
		$keyLn = mb_strlen($key, $enc);
		if ($keyLn > $maxKeyLn) {
			$maxKeyLn = $keyLn;
		}
	}
	for ($offset = 0; $offset < $strLn;) {
		for ($ln = $maxKeyLn; $ln >= 1; $ln--) {
			$cmp = $charArray[$offset];
			if (isset($map[$cmp])) {
				$out .= $map[$cmp];
				$offset += $ln;
				continue 2;
			}
		}
		$out .= $charArray[$offset];
		$offset++;
	}
	return $out;
}

/**
 * Аналог ucfirst для работы с мультибайтовыми кодировками из класса stingUtils
 *
 * @author ?, Mikhail Estrin
 * @version 1.0, 16.08.2018
 *
 * @param $str Входящая строка
 * @return string Строка с замененными символами
 */
function mb_ucfirst($str) {
	return mbStringUtils . phpmb_strtoupper(mb_substr($str, 0, 1));
}

/**
 * Аналог ucwords для работы с мультибайтовыми кодировками из класса stingUtils
 *
 * @author ?, Mikhail Estrin
 * @version 1.0, 16.08.2018
 *
 * @param $str Входящая строка
 * @return string Строка с замененными символами
 */
function mb_ucwords($str) {
	$arr = explode(' ', $str);
	$str = '';
	foreach ($arr as $key) {
		$word = mbStringUtils . phpmb_strtoupper(mb_substr($key, 0, 1));
		$str .= ' ' . $word;
	}
	return $str;
}