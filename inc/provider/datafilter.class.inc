<?php

namespace Provider;

use Storage\Datatype\BaseType;
use Storage\DataFilterNodeTemplate;

/**
 * Класс фильтр для защиты от XSS и SQL
 */
class DataFilter {

	/**
	 * Константа для обозначения POST
	 */
	const FROM_POST = 'post';

	/**
	 * Константа для обозначения GET
	 */
	const FROM_GET = 'get';

	/**
	 * Пользовательский массив данных
	 */
	const FROM_USER_DATA = 'UserData';

	/**
	 * Тут будем хранить сырые данные
	 * @var array
	 */
	private $dataRaw = [];

	/**
	 * Хранилище шаблонов данных
	 * @var array
	 */
	private $dataTemplates = [];

	/**
	 * Массив для хранения выполненных запросов, чтобы не плодить лишние объекты и повторно ничего не обрабатывать
	 * 2 поля, ключ => значение
	 * @var array
	 */
	private $requestsTmp = [];

	/**
	 * Конструктор принимает шаблон данных
	 *
	 * @param array $dataTemplates
	 * @param array $UserDataArray Любой массив данных, работает по принципу post или get шаблон для него должен передаваться в UserData можно использовать константу DataFilter::FROM_USER_DATA
	 *
	 * Пример:
	 *
	 * $myArray = ['name' => 'Иван', 'secondName' => 'Иванов'];
	 * $Filter = new DataFilter([
	 * 		'post' => ['id' => new DataTypeInteger()], //допустим в post просто передался id
	 * 		'UserData' => [ //Это карта-описание для переданного пользовательского массива UserData - указывается в обязательном порядке можно
	 * 						'name' =>  new DataTypeString(), //Тут вызываются 2 фильтра
	 * 						'secondName' => new DataTypeString()
	 * 					]
	 * ], $myArray);
	 *
	 * $Filter->fromUserData('name'); //вернет строку с именем
	 * $Filter->fromPost('id'); //вернет идентификатор integer
	 *
	 */
	public function __construct(array $dataTemplates = [], $UserDataArray = [])
	{
		if ($dataTemplates && is_array($dataTemplates)) {
			$this->dataTemplates = $dataTemplates;
			if (key_exists(self::FROM_POST, $dataTemplates)) {
				$this->dataRaw[self::FROM_POST] = $_POST;
			}

			if (key_exists(self::FROM_GET, $dataTemplates)) {
				$this->dataRaw[self::FROM_GET] = $_GET;
			}
			$this->dataRaw[self::FROM_USER_DATA] = $UserDataArray;
		}
	}

	/**
	 * Метода получает данные по ключу шаблона, имя и доп параметр
	 *
	 * @param string $key ключ
	 * @return array
	 */
	private function getTplKeyInfo(string $key): array
	{
		$keyData = explode(':', $key);
		$keyResult = [];
		$keyResult['key'] = array_shift($keyData);
		$keyResult['option'] = array_shift($keyData);
		return $keyResult;
	}

	/**
	 * Функция возвращает данные по ключу для куска шаблона
	 *
	 * @param mixed $key ключ пути
	 * @param array $template кусок шаблона
	 */
	private function getTemplate($key, $template): array
	{
		$finalTemplate = $template;
		$finalKey = $key;
		if (is_array($template)) {
			$tplKeys = array_keys($template);
			foreach ($tplKeys as $tplKey) {
				$keyInfo = $this->getTplKeyInfo($tplKey);
				if (preg_match_all('/^' . $keyInfo['key'] . '$/u', $key)) {
					$finalTemplate = $template[$keyInfo['key'] . ($keyInfo['option'] ? ':' . $keyInfo['option'] : '')];
					$finalKey = $tplKey;
					break;
				}
			}
		}

		return [
			'template' => $finalTemplate,
			'key' => $finalKey
		];
	}

	/**
	 * Рекурсивный метод, получает данные из массива любой вложенности
	 * @param array $way Путь до конечного значения
	 * @param array $data Description
	 * @param array $template
	 * @return DataFilterNodeTemplate данные и шаблон
	 */
	private function getData($way, &$data, $template)
	{
		$result = false;
		if (is_array($way)) {
			//Отрезаем 1 элемент массива
			$now = array_shift($way);
			$tpl = $this->getTemplate($now, $template);
			$data[$now] = $this->checkSubType($tpl['key'], $data[$now]);
			if (count($way)) {
				return $this->getData($way, $data[$now], $tpl['template']);
			} else {
				$result = new DataFilterNodeTemplate($data[$now], $tpl);
			}
		}
		return $result;
	}

	/**
	 * Метод возвращает объект DataType по заданным параметрам
	 * при попытке вставить в массив объекты не наследованные от DataType будет возвращен null
	 * @param DataFilterNodeTemplate $simpleData
	 */
	private function createDataByType($simpleData)
	{
		$result = [];
		//Если это массив, обработаем его как массив
		if (is_array($simpleData->data)) {
			foreach ($simpleData->data as $dKey => $dField) {
				$SubFilter = $this->getTemplate($dKey, $simpleData->template['template']);
				if (is_array($dField)) {
					$creatType = $this->createDataByType(new DataFilterNodeTemplate($dField, $SubFilter));
					$result[$dKey] = !is_object($creatType) ? $creatType : $creatType->set($dField)->get();
				} else {
					if ($SubFilter && $SubFilter['template'] instanceof BaseType) {
						$result[$dKey] = $SubFilter['template']->set($dField)->get();
					}
				}
			}
		} else {
			//Если это не массив, сделаем массив, и вызовем функцию вместо того чтобы дублировать код
			$temp = $this->createDataByType(new DataFilterNodeTemplate([$simpleData->data], $simpleData->template));
			$result = array_pop($temp);
		}

		return $result;
	}

	/**
	 * Функция доступа к данным через шаблон по типу основная
	 * @param string $type Константа или строка с наименованием паблик свойства
	 * @param string $fields Поля через которые мы обратимся к массиву, например _getFrom('user', 'name') эквивалентно $this->_post->user->name
	 */
	private function getFrom($type, $fields)
	{
		array_unshift($fields, $type);
		$key = implode('#', $fields);
		if (!$this->requestsTmp[$key]) {
			$dataRaw = $this->dataRaw;
			$this->requestsTmp[$key] = $this->createDataByType($this->getData($fields, $dataRaw, $this->dataTemplates));
		}

		// Если в массиве 1 элемент вернем его, иначе массив
		return $this->requestsTmp[$key];
	}

	/**
	 * Функция доступа к данным оберточная для POST
	 * @param string $field Наименование поля
	 * @return mixed Отфильтрованные данные
	 */
	public function fromPost() {
		return $this->getFrom(self::FROM_POST, func_get_args());
	}

	/**
	 * Функция доступа к данным оберточная для GET
	 * @param string $field Наименование поля
	 * @return mixed Отфильтрованные данные
	 */
	public function fromGet() {
		return $this->getFrom(self::FROM_GET, func_get_args());
	}

	/**
	 * Функция доступа к данным оберточная для Пользовательского массива, введенного вторым аргументом при construct
	 * @param string $field Наименование поля
	 * @return mixed Отфильтрованные данные
	 */
	public function fromUserData() {
		return $this->getFrom(self::FROM_USER_DATA, func_get_args());
	}

	/**
	 * Метод задает шаблон для данных
	 * @param string $type Константа или строка с наименованием паблик свойства
	 * @param array $template Шаблон данных
	 */
	public function setTemplate($type, array $template)
	{
		if (is_array($template)) {
			$this->dataTemplates[$type] = $template;
		}
	}

	/**
	 * Функция задает шаблон данных для POST
	 *
	 * @param array $template Шаблон данных
	 */
	public function setPostTemplate($template)
	{
		$this->setTemplate(self::FROM_POST, $template);
	}

	/**
	 * Функция задает шаблон данных для GET
	 *
	 * @param array $template Шаблон данных
	 */
	public function setGetTemplate($template)
	{
		$this->setTemplate(self::FROM_GET, $template);
	}


	/**
	 * Метод проверяет в шаблоне у ключа подтип (пока это json) и выполняет дополнительное преобразование данных
	 *
	 * @param string $key ключ из карты формата поле:подтип <=> user:json
	 * @param mixed $data кусок данных для преобразования
	 * @return mixed
	 */
	private function checkSubType($key, $data)
	{
		$keyInfo = $this->getTplKeyInfo($key);
		if (!empty($keyInfo)) {
			$methodName = '_' . $keyInfo['option'];
			if (method_exists($this, $methodName)) {
				$data = $this->$methodName($data);
			}
		}
		return $data;
	}
}
