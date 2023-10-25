<?php

/**
 * Класс для автоматического подключения файлов
 */
class LmAutoloader
{
	/** Тип файла - класс */
	const CLASS_FILE_TYPE = '.class.inc';
	/** Тип файла - контроллер */
	const CONTROLLER_FILE_TYPE = '.controller.inc';
	/** Тип класса - контроллер */
	const CONTROLLER = 'controller';

	/**
	 * Регистрирует функцию авто регистрации классов
	 *
	 * @return void
	 */
	public static function register()
	{
		spl_autoload_register([new self(), 'autoload']);
	}

	/**
	 * Функция автоматической регистрации классов
	 *
	 * @param string $className Название класса
	 * @return void
	 */
	public function autoload(string $className)
	{
		$className = mb_strtolower($className);
		$fileType = $this->getFileType($className);

		if ($fileType === self::CONTROLLER_FILE_TYPE) {
			$className = preg_replace('/(\w+)' .  self::CONTROLLER . '/', '$1', $className);
		}
		
		self::loadFile($className, $fileType);
	}

	/**
	 * Узнает тип файла по имени
	 *
	 * @param string $className Название класса
	 * @return string
	 */
	private function getFileType(string $className): string
	{
		return strpos($className, self::CONTROLLER) !== false && ($className !== self::CONTROLLER)
			? self::CONTROLLER_FILE_TYPE
			: self::CLASS_FILE_TYPE;
	}

	/**
	 * Подключает файл
	 *
	 * @param string $className Название класса
	 * @param string $fileType Тип файла вида '.class.inc'
	 * @return void
	 */
	public static function loadFile(string $className, string $fileType)
	{
		$namespace = '';
		$className = trim($className, '\\');
		if (strpos($className, '\\') !== false) {
			$pathParts = explode('\\', $className);
			if ($pathParts) {
				$className = array_pop($pathParts);
				$namespace = implode(DIRECTORY_SEPARATOR, $pathParts) . DIRECTORY_SEPARATOR;
			}
		}

		$filePath = __DIR__ . DIRECTORY_SEPARATOR . $namespace . $className . $fileType;
		if (is_file($filePath)) {
			require_once $filePath;
		}
	}
}