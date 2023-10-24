<?php

namespace Provider;

use mysqli;
use Storage\LmMysqlResult;

/**
 * Класс для работы с базами данных
 */
class LmMysql
{
	/** время жизни сессионого флага для принудительного чтения с мастера */
	const FRFMSESSION_LIFETIME = 15;
	/** время жизни соединения с БД */
	const CONNECTION_TTL = 15;

	/** Стандартное количество вставляемых строк в одном цикле */
	const DEFAULT_PACK_FOR_INSERT = 500;
	/** Максимальное значение вставляемых строк в одном цикле */
	const MAX_PACK_FOR_INSERT = 5000;

	/** Вернуть результат после проверки значения */
	const CHECK_DB_FLAG_RESULT = 0;
	/** Вернуть результат после проверки значения, если он не пустой */
	const CHECK_DB_FLAG_NOT_EMPTY_RESULT = 1;
	/** Вернуть количество вставленных строк */
	const CHECK_DB_FLAG_INSERT_ID = 2;
	/** Вернуть количество затронутых строк */
	const CHECK_DB_FLAG_AFFECTED_ROWS = 3;

	/** вариант = ON DUPLICATE KEY UPDATE для inserWithPrepare */
	const INSERT_ODKU_EQUAL = 'odkuEqual';
	/** Тип ON DUPLICATE KEY UPDATE для inserWithPrepare */
	public $insert_with_prepare_odku_type = '';

	/** флаг вкл/выкл реконект по тайм ауту */
	public $reconnectByTimeout = true;
	/** @var int Время в секундах до автоматического переподключения к БД */
	public $connectionTTL = self::CONNECTION_TTL;
	public $insertId = null;
	public $affectedRows = null;

	private static $dbConf = [];
	/** таблицы, для которых требуется чтение с мастера в течение сессии */
	private static $sessionFRFMTables = [];
	/** временная переменная, время, потраченное на операции определения необходимости FRFM */
	private static $timeSpentOnFRFM = 0.0;
	/** временная переменная, массив содержит количество select-запросов и количество запросов на обновление */
	private static $numberOfRequests = [];

	/** настройки мастера */
	private $master = null;
	/** настройки слейвов */
	private $slaves = null;
	/** таблицы, подверженные рассинхронизации со слейвами */
	private $allowFRFMTables = [];
	/** коннект с мастером*/
	private $masterConnect = null;
	/** коннект со слейвом */
	private $slaveConnect = null;
	private $lastConnect = 0;
	/** результат запроса */
	private $stmt = null;
	/** признак запущенной транзакции */
	private $transaction = false;
	/** Дебаг false-выключено;true-включено */
	private $debug = false;
	/** 0-в файл;1-на экран */
	private $debugMode = 0;
	/** временный флаг, который указывает что читать нужно принудительно с мастера */
	private $forcedReadingMaster = false;
	/** флаг, который указывает что читать нужно принудительно с мастера */
	private $forcedReadingMasterInfinitely = false;
	/** сессионный флаг, который указывает что читать нужно принудительно с мастера */
	private $forcedReadingMasterSession = false;
	private $lastNumRows = false;
	private $debugQueries = [];
	/** timestamp инициализации инстанса LmMySQL */
	private $initTime = 0;
	private static $instances = [];

	/**
	 * Если включена опция реконнекта по тайм ауту
	 * Проверяет не прошло ли достаточно времени с момента подключения (15 (по умолчанию) - 2 секунды)
	 * Если да, производит переподключение.
	 * В любом случае обнуляет $_initTime(timestamp инициализации инстанса LmMySQL)
	 */
	private function reconnectIfNeeded()
	{
		if ($this->reconnectByTimeout) {
			if ($this->connectionTTL <= 2) {
				$this->connectionTTL = self::CONNECTION_TTL;
			}
			$time = time();
			if ($time - $this->initTime > ($this->connectionTTL - 2)) {
				$this->reconnect();
			}
			$this->initTime = $time;
		}
	}

	/**
	 * Функция экранирования строки. Необходимо использовать
	 * при построении запроса без плейсхолдеров. Н-р, в таком случае:
	 *      $p = [];
	 *      foreach ($a as $k => $v) {
	 *          if (is_numeric($v))
	 *              $p[] = $k.'='.$v;
	 *          else
	 *              $p[] = $k.'=\''.$lmMysql->realEscapeString($v).'\'';
	 *      }
	 *      if ($p) {
	 *          $lmMysql->query('UPDATE table SET '.implode(',', $p)).' WHERE id='.(int)$id;
	 *      }
	 * @access public
	 * @param string $value
	 * @return string|false
	 */
	public function realEscapeString($value)
	{
		if ($this->slaveConnect) {
			return $this->slaveConnect->real_escape_string($value);
		} elseif ($this->masterConnect) {
			return $this->masterConnect->real_escape_string($value);
		} else {
			$this->checkSlaveConnect();
			return $this->slaveConnect->real_escape_string($value);
		}
	}

	/**
	 * Возвращает экземпляр класса для соответсвующих настроек.
	 * Насторйки см. в settings.mysql.php
	 *
	 * @param string $configname
	 * @return lmMysql
	 */
	public static function getInstance($configname = 'default')
	{
		if (!self::$dbConf) {

			require __DIR__ . '/../../settings.mysql.php';
			if (!isset($dbConf['default'])) {

				trigger_error("Default settings for mysql connection should be defined");
			}
			self::$dbConf = $dbConf;
		}

		if (!isset(self::$instances[$configname])) {
			if ($configname != 'default' && isset(self::$instances['default']) && self::$dbConf[$configname]['slaves'] == self::$dbConf['default']['slaves'] && self::$dbConf[$configname]['master'] == self::$dbConf['default']['master']) {
				return self::$instances['default'];
			}
			self::$instances[$configname] = new lmMysql;
			self::$instances[$configname]->init($configname);

		}

		return self::$instances[$configname];
	}

	/**
	 * Запрещаем создание объектов, клонирование и десериализацию
	 */
	private function __construct() {}
	private function __clone() {}
	public function __wakeup() {}
	public function __sleep() {}

	/**
	 * Функция включения дебага
	 *
	 * @param int $mode 0 - запись в файл, 1 - вывод на экран
	 * @return void
	 */
	public function debugEnable($mode = 0)
	{
		$this->debug = true;
		$this->debugMode = $mode;
	}

	/**
	 * Функция отключения дебага
	 *
	 * @return void
	 */
	public function debugDisable()
	{
		$this->debug = false;
	}

	/**
	 * Функция для дебага. Собирает запрос и пишет в файл.
	 *
	 * @return void
	 */
	private function debug($arguments = 0)
	{
		$query = '';
		if ($arguments === 0) {
			$err = $this->error();
			if ($err) {
				$query = $err;
			}
		} else {
			$query = $arguments[0];
			for ($i = 0; $i < (count($arguments) - 1); $i++) {
				$tmp = $arguments[$i + 1];
				$query = preg_replace('/\?/u', "'" . $tmp . "'", $query, 1);
			}
		}
		if ($query) {
			if ($this->debugMode == 0)
				system("echo \"" . addslashes($query) . "\" >> mysql.debug");
			elseif ($this->debugMode == 1) {
				echo $query . "<br />";
			} elseif ($this->debugMode == 2) {
				$this->debugQueries[] = $query;
			}
		}
	}

	public function getDebugQueries()
	{
		return $this->debugQueries;
	}

	/**
	 * Инициализация объекта. Читаются настройки доступов к бд и создается соединение со слейвом.
	 */
	private function init($configname = 'default')
	{

		$this->initTime = time();
		$this->master = self::$dbConf[$configname]['master'];
		$this->slaves = self::$dbConf[$configname]['slaves'];
		$this->allowFRFMTables = self::$dbConf[$configname]['allowFRFMTables'] ?? []; // инициализация таблиц, подверженных рассинхронизации мастер-слейв

		// инициализация сессионного параметра forceReadFromMaster
		if (isset($_SESSION['globalForceReadFromMaster'])) {
			if ($_SESSION['globalForceReadFromMaster'] >= time()) {
				$this->forcedReadingMasterSession = true;
			} else {
				unset($_SESSION['globalForceReadFromMaster']);
			}
		}

		// инициализация сессионных таблиц, для которых требуется чтение с мастера
		if (!self::$sessionFRFMTables) {
			$timeStart = microtime(true);
			if (isset($_SESSION['globalFRFMTables'])) {
				$removeSession = true;
				foreach ($_SESSION['globalFRFMTables'] as $table => $time) {
					if ($time >= time()) {
						self::$sessionFRFMTables[$table] = 1;
						$removeSession = false;
					} else {
						unset($_SESSION['globalFRFMTables'][$table]);
					}
				}
				if ($removeSession) {
					unset($_SESSION['globalFRFMTables']);
				}
			}
			self::$timeSpentOnFRFM += microtime(true) - $timeStart;
		}

		if (!self::$numberOfRequests) {
			self::$numberOfRequests['select'] = [];
			self::$numberOfRequests['select']['master'] = 0;
			self::$numberOfRequests['select']['slave']  = 0;
			self::$numberOfRequests['update'] = [];
			self::$numberOfRequests['update']['really'] = 0;
			self::$numberOfRequests['update']['empty']  = 0;
		}
	}

	/**
	 * Проверка и если необходимо установливает соединение со слейвом
	 */
	private function checkSlaveConnect()
	{
		if (!$this->slaveConnect) {
			$ignoreList = [];
			$slaveId = null;
			while ($this->slaveConnect == null) {
				$slaveId = $this->getNumberSlave($ignoreList);
				if ($slaveId === false)
					die();
				$this->slaveConnect = new mysqli($this->slaves[$slaveId]['host'], $this->slaves[$slaveId]['user'], $this->slaves[$slaveId]['password'], $this->slaves[$slaveId]['db'], $this->slaves[$slaveId]['port']);
				if ($this->slaveConnect->connect_error) {
					$ignoreList[] = $slaveId;
					@$this->slaveConnect->close();
					$this->slaveConnect = null;
				}
			}
			$this->slaveConnect->set_charset($this->slaves[$slaveId]['charset']);
		}
		return true;
	}

	/**
	 * Проверяет и если необходимо устанавливает соединение с мастером
	 *
	 * @return true|false
	 */
	private function checkMasterConnect()
	{
		if (!$this->masterConnect) {
			for ($count = 0; $count < 3; $count++) {
				$this->masterConnect = new mysqli($this->master['host'], $this->master['user'], $this->master['password'], $this->master['db'], $this->master['port']);
				if ($this->masterConnect->connect_error) {
					$this->masterConnect->close();
					$this->masterConnect = null;
				} else {
					break;
				}
			}
			if (!$this->masterConnect)
				die();
			$this->masterConnect->set_charset($this->master['charset']);
		}
		return true;
	}

	/**
	 * Функция для определения по системе весов, к какому слейву коннетиться
	 *
	 * @return integer
	 */
	private function getNumberSlave($ignore = null)
	{
		if (count($this->slaves) == 0)
			return false;
		$sumWeight = 0;
		for ($i = 0; $i < count($this->slaves); $i++) {
			if (is_array($ignore) && in_array($i, $ignore))
				continue;
			$sumWeight += $this->slaves[$i]['weight'];
		}
		if ($sumWeight == 0)
			return false;
		$rnd = mt_rand(0, $sumWeight - 1);
		$pos = 0;
		while ($rnd >= 0) {
			if (is_array($ignore) && in_array($pos, $ignore)) {
				$pos++;
				continue;
			}
			$rnd -= $this->slaves[$pos]['weight'];
			$pos++;
		}
		if ($pos == -1)
			return false;
		return $pos - 1;
	}

	/**
	 * Функция старта транзакции.
	 *
	 * @return void
	 */
	public function transactionStart()
	{
		$this->checkMasterConnect();
		$this->transaction = true;
		return $this->masterConnect->autocommit(false);
	}

	/**
	 * Функция коммита транзакции
	 *
	 * @return bool
	 */
	public function transactionCommit()
	{
		$this->transaction = false;
		$result = $this->masterConnect->commit();
		$this->masterConnect->autocommit(true);
		return $result;
	}

	/**
	 * Функция отката транзакции
	 *
	 * @return void
	 */
	public function transactionRollBack()
	{
		$this->masterConnect->rollback();
		$this->transactionCommit();
	}

	/**
	 * Функция выполнения запросов. Проверяет запросы на изменение данных без where и выполняет unsafeQuery()
	 *
	 * @return lmMysqlResult|bool
	 */
	public function query()
	{
		$this->lastNumRows = false;

		$arguments = func_get_args();
		$query = mb_strtolower(trim($arguments[0]));
		$args = array('');
		$Q = '';

		if ((mb_strpos($query, 'delete') !== false || mb_strpos($query, 'update') !== false) && mb_strpos($query, ' limit ') !== false && mb_strpos($query, 'order by') === false) {
			trigger_error('Error query string: '. $query);
		}

		if (mb_strpos($query, 'update') === 0 || mb_strpos($query, 'delete') === 0) {
			if (mb_strpos($query, "where") === false) {
				trigger_error('You should define WHERE clause for update/delete queries');
				return false;
			}
		}

		///КОСТЫЛЬ ПОКА БАЗА В 1251
		/*	for ($i = 0; $i < count($arguments); $i++){
				if (is_string($arguments[$i])){
					$arguments[$i] = Strings::utfEntity($arguments[$i]);
				}
			}*/
		///вырезать как база перейдет на utf-8

		$cnt = 0;
		$q1 = 0; // singe quot is opened
		$q2 = 0; // double quot is opened
		$s = 0; // last character is slash

		$arguments[0] = preg_split('//u', $arguments[0]);
		array_splice($arguments[0], 0, 1);
		array_splice($arguments[0], count($arguments[0]) - 1, 1);
		$len = count($arguments[0]);

		for ($i = 0; $i < $len; $i++) {
			$ch = $arguments[0][$i];

			if ($ch == '\\') {
				if (!$s) // Если только слэш не экранирован сам
					$s = 1;
				else
					$s = 0;
				$Q .= $ch;
				continue;
			}

			if ($ch == "'" && !$s) {
				if (!$q2) {
					$q1 = (!$q1) ? 1 : 0;
				}
				$Q .= $ch;
			} elseif ($ch == '"' && !$s) {
				if (!$q1) {
					$q2 = (!$q2) ? 1 : 0;
				}
				$Q .= $ch;
			} elseif ($ch == '?') {
				if ($q1 || $q2) {
					$Q .= $ch;
					continue;
				}

				$cnt++;
				if (!isset($arguments[$cnt])) {
					$Q .= 'UNKNOWN_PLACEHOLDER';
					if (isset($arguments[0][$i + 1]) && $arguments[0][$i + 1] == '@')
						$i++;
					continue;
				}
				if (isset($query[$i + 1]) && $query[$i + 1] == '@') {
					if (!is_array($arguments[$cnt])) {
						$Q .= 'NON_ARRAY_PLACEHOLDER';
					} else {
						if (is_array($arguments[$cnt]) && count($arguments[$cnt]) > 0) {
							$Q .= implode(',', array_fill(0, count($arguments[$cnt]), '?'));
							$args = array_merge($args, $arguments[$cnt]);
						} else {
							trigger_error('lmmysql placeholder ?@ is empty. Stack:'.getFuntionsChain());
						}
					}
					$i++;
				} else {
					$Q .= $ch;
					$args[] = $arguments[$cnt];
				}
			} else {
				$Q .= $ch;
			}

			$s = 0;
		}

		$args[0] = $Q;
		$result = call_user_func_array(array($this, 'unsafeQuery'), $args);
		if ($result === false && $this->errno() == 2006) {
			//try to reconnect
			$this->ping();
			$result = call_user_func_array(array($this, 'unsafeQuery'), $args);
		}
		return $result;
	}

	/**
	 * Функция сразу возвращает массив (не нужен while-цикл)
	 *
	 * @return array|false
	 */
	public function fetchAll()
	{
		$args = func_get_args();
		$result = call_user_func_array(array($this, 'query'), $args);
		if ($result === false)
			return false;
		$data = [];
		while ($row = $result->fetchAssoc())
			$data[] = $row;

		return $data;
	}

	/**
	 * Возвращает первую строку запроса
	 *
	 * @return array|false
	 */
	public function fetchFirstRow()
	{
		$args = func_get_args();
		$result = call_user_func_array(array($this, 'query'), $args);
		if ($result === false) {
			return false;
		}
		return ($result->numRows) ? $result->fetchAssoc() : [];
	}

	/**
	 * Функция сразу возвращает массив (не нужен while-цикл)
	 *
	 * @return array|false
	 */
	public function fetchAllByKey()
	{
		$args = func_get_args();
		$key = array_shift($args);
		$result = call_user_func_array(array($this, 'query'), $args);
		if ($result === false)
			return false;

		$data = [];
		while ($row = $result->fetchAssoc()) {
			if (!isset($row[$key]))
				throw new Exception("Unknown key: $key");

			$data[$row[$key]] = $row;
		}

		return $data;
	}

	/**
	 * Возвращает значение первого поля в SELECT
	 *
	 * @return mixed
	 */
	public function fetchFirstField()
	{
		$args = func_get_args();
		$result = call_user_func_array(array($this, 'query'), $args);
		if ($result === false) {
			return false;
		}
		return $result->fetchFirstField();
	}

	/**
	 * Возвращает массив значений первого поля в запросе
	 * Н-р: SELECT id FROM table WHERE ...
	 * Результат будет следующего вида:
	 * array(123,355, .....) или false
	 *
	 * @return array|false
	 */
	public function fetchFirstColumn()
	{
		$args = func_get_args();
		$result = call_user_func_array(array($this, 'query'), $args);
		if ($result === false)
			return false;

		$data = [];
		while ($row = $result->fetchAssoc()) {
			$tmp = array_values($row);
			$data[] = $tmp[0];
		}

		return $data;
	}

	/**
	 * Возвращает массив ключ - значение
	 *
	 * @return array|false
	 */
	public function fetchFirstColumnByKey()
	{
		$args = func_get_args();
		$key = array_shift($args);
		$result = call_user_func_array(array($this, 'query'), $args);
		if ($result === false)
			return false;

		$data = [];
		while ($row = $result->fetchAssoc()) {
			if (!isset($row[$key])) {
				throw new Exception("Unknown key: $key");
			}

			$tmp = array_values($row);
			$data[$row[$key]] = $tmp[1];
		}

		return $data;
	}

	public function getLastNumRows()
	{
		return $this->lastNumRows;
	}

	/**
	 * Пример:
	 *
	 * $lmMysql->update(
	 *      'table',
	 *      array(
	 *          'field1' => $value1,
	 *          'field2' => $value2
	 *      ),
	 *      array(
	 *          'field3' => $value3
	 *          'field4' => $value4,
	 *      )
	 * );
	 *
	 * Будет сгенерирован запрос:
	 * UPDATE table SET field3=$value3, field4=$value4 WHERE field1=$value1 AND field2=$value2
	 *
	 * @access public
	 * @param string $table
	 * @param array $conditionKeys
	 * @param array $params
	 * @return bool
	 */
	public function update($table, $conditionKeys, $params)
	{
		if (!$table) {
			throw new Exception("You should define table for update");
		}

		if (!$conditionKeys) {
			throw new Exception("You should define keys for where clause");
		}

		if (!$params) {
			throw new Exception("You should define updated parameters");
		}

		$q = 'UPDATE ' . $table . ' SET ';

		$p = [];
		foreach ($params as $k => $v) {
			if (is_numeric($v))
				$p[] = '`' . $k . '`=' . $v;
			else
				$p[] = '`' . $k . '`=\'' . $this->realEscapeString($v) . '\'';
		}

		$q .= implode(', ', $p);

		$p = [];
		foreach ($conditionKeys as $k => $v) {
			if (is_numeric($v))
				$p[] = '`' . $k . '`=' . $v;
			else
				$p[] = '`' . $k . '`=\'' . $this->realEscapeString($v) . '\'';
		}

		$q .= ' WHERE ' . implode(' AND ', $p);
		return (bool) $this->query($q);
	}

	public function delete($table, $params)
	{
		if (!$table) {
			throw new Exception("You should define table for update");
		}

		if (!$params) {
			throw new Exception("You should define updated parameters");
		}

		$q = 'DELETE FROM ' . $table ;

		$p = [];
		foreach ($params as $k => $v) {
			if (is_numeric($v))
				$p[] = '`' . $k . '`=' . $v;
			else
				$p[] = '`' . $k . '`=\'' . $this->realEscapeString($v) . '\'';
		}

		$q .= ' WHERE ' . implode(' AND ', $p);

		return $this->query($q);
	}

	public function replace($table, $params)
	{
		if (!$table) {
			throw new Exception("You should define table for insert");
		}

		if (!$params) {
			throw new Exception("You should define inserted parameters");
		}

		$types = array(
			's' => 1, //string
			'i' => 1, //integer
			'f' => 1, //float
			'q' => 1, //query
		);

		$q = 'REPLACE INTO ' . $table . ' SET ';

		$p = [];
		foreach ($params as $k => $v) {
			$type = false;
			if (isset($k[1]) && $k[1] == ':' && isset($types[$k[0]])) {
				$type = $k[0];
				$k = mb_substr($k, 2);
			}

			switch ($type) {

				case 'i':
					$p[] = '`' . $k . '`=' . (int) $v;
					break;

				case 'f':
					$p[] = '`' . $k . '`=' . (float) $v;
					break;

				case 's':
					$p[] = '`' . $k . '`=\'' . $this->realEscapeString($v) . '\'';
					break;
				case 'q':
					$p[] = '`' . $k . '`=' . $v;
					break;
				default :
					if (is_numeric($v)) {
						$p[] = '`' . $k . '`=' . str_replace(',', '.', $v);
					} else {
						$p[] = '`' . $k . '`=\'' . $this->realEscapeString($v) . '\'';
					}
			}
		}
		$q .= implode(', ', $p);
		return $this->query($q);
	}

	public function insert($table, $params)
	{
		if (!$table) {
			throw new Exception("You should define table for insert");
		}

		if (!$params) {
			throw new Exception("You should define inserted parameters");
		}

		$types = array(
			's' => 1, //string
			'i' => 1, //integer
			'f' => 1, //float
		);

		$q = 'INSERT INTO ' . $table . ' SET ';

		$p = [];
		foreach ($params as $k => $v) {

			$type = false;
			if (isset($k[1]) && $k[1] == ':' && isset($types[$k[0]])) {
				$type = $k[0];
				$k = mb_substr($k, 2);
			}

			switch ($type) {

				case 'i':
					$p[] = '`' . $k . '`=' . (int) $v;
					break;

				case 'f':
					$p[] = '`' . $k . '`=' . (float) $v;
					break;

				case 's':
					$p[] = '`' . $k . '`=\'' . $this->realEscapeString($v) . '\'';
					break;

				default :
					if (is_numeric($v)) {
						$p[] = '`' . $k . '`=' . str_replace(',', '.', $v);
					} else {
						$p[] = '`' . $k . '`=\'' . $this->realEscapeString($v) . '\'';
					}
			}
		}

		$q .= implode(', ', $p);
		return (bool) $this->query($q);
	}

	/**
	 * Функция экранирования строки. Необходимо использовать
	 * при построении запроса без плейсхолдеров. Н-р, в таком случае:
	 *      $p = [];
	 *      foreach ($a as $k => $v) {
	 *          if (is_numeric($v))
	 *              $p[] = $k.'='.$v;
	 *          else
	 *              $p[] = $k.'=\''.$lmMysql->quote($v).'\'';
	 *      }
	 *      if ($p) {
	 *          $lmMysql->query('UPDATE table SET '.implode(',', $p)).' WHERE id='.(int)$id;
	 *      }
	 * @param string $value
	 * @return string|false
	 */
	public function quote($value)
	{
		if ($this->slaveConnect) {
			return $this->slaveConnect->real_escape_string($value);
		} elseif ($this->masterConnect) {
			return $this->masterConnect->real_escape_string($value);
		} else {
			return false;
		}
	}

	/**
	 * Функция выполнения запросов
	 *
	 * @return array|true|false
	 */
	public function unsafeQuery()
	{
		$arguments = func_get_args();
		$query = mb_strtolower(trim($arguments[0]));

		// закрытие потенциальной дыры от листинга таблиц SELECT * FROM information_schema.tables
		if (mb_strpos($query, 'information_schema') !== false) {
			trigger_error('TRIGGER: information_schema in sql-query detected!');
			return false;
		}
		if (mb_strpos($query, 'select') === 0 || mb_strpos($query, 'describe') === 0 || mb_strpos($query, '(select') === 0) {
			return call_user_func_array(array($this, 'select'), $arguments);
		} else {
			return call_user_func_array(array($this, 'updateQuery'), $arguments);
		}
	}

	/**
	 * Функция устанавливает флаг принудительного исполнения следующего запроса на мастере
	 *
	 * @return lmMysql
	 */
	public function forceReadFromMaster()
	{
		$this->forcedReadingMaster = true;
		return $this;
	}

	/**
	 * Функция устанавливает флаг принудительного исполнения всех следующих запросов на мастере
	 *
	 * @param bool
	 */
	public function forceReadFromMasterInfinitely($on = true)
	{
		if ($on) {
			$this->forcedReadingMasterInfinitely = true;
		} else {
			$this->forcedReadingMasterInfinitely = false;
		}
	}

	/**
	 * Функция устанавливает флаг принудительного исполнения следующего запроса на мастере, если это задано в сессии
	 *
	 * @return lmMysql
	 */
	public function forceReadFromMasterSession()
	{
		if ($this->forcedReadingMasterSession) {
			$this->forcedReadingMaster = true;
		}
		return $this;
	}

	/**
	 * Функция записывает в сессию метку времени, до которой необходимо принудительное исполнения запросов на мастере.
	 *
	 * Введена для решения проблемы рассинхронизации мастер-слейв.
	 *
	 * @return void
	 */
	public static function setSessionFRFM()
	{
		$_SESSION['globalForceReadFromMaster'] = time() + self::FRFMSESSION_LIFETIME;
	}

	/**
	 * Функция добавляет название таблицы в сессию, для которой необходимо принудительное исполнения запросов на мастере, и обновляет метку времени, до которого
	 * это необходимо.
	 *
	 * Введена для решения проблемы рассинхронизации мастер-слейв.
	 *
	 * @return void
	 */
	public static function setSessionFRFMForTable($table)
	{
		if (!isset($_SESSION['globalFRFMTables'])) {
			$_SESSION['globalFRFMTables'] = [];
		}
		$_SESSION['globalFRFMTables'][$table] = time() + self::FRFMSESSION_LIFETIME;
	}

	/**
	 * Получение статуса ReadFromMaster
	 *
	 * @return int
	 */
	public function getReadFromMasterStatus()
	{
		if ($this->forcedReadingMasterInfinitely) {
			return 2;
		} elseif ($this->forcedReadingMaster) {
			return 1;
		} else {
			return 0;
		}
	}

	/**
	 * Функция для запросов SELECT
	 */
	public function select()
	{
		$this->insertId = null;
		$this->affectedRows = null;
		$arguments = func_get_args();
		$query = $arguments[0];

		$this->reconnectIfNeeded();

		if ($this->transaction || $this->forcedReadingMaster || $this->forcedReadingMasterInfinitely || PHP_SAPI == 'cli') {
			if ($this->transaction) {
				if (!$this->masterConnect) {
					trigger_error('Connection is corrupted');
					return false;
				}

				$result = $this->masterConnect->query('SELECT @@autocommit AS value');
				if (!$result) {
					trigger_error("MYSQL ERROR during opened transaction: " . $this->masterConnect->error);
					return false;
				}

				$row = $result->fetch_assoc();
				if ($row['value'] == 1) {
					trigger_error("Connection has enabled autocommit during opened transaction");
					return false;
				}
			} else {
				$this->checkMasterConnect();
				$this->lastConnect = 1;
			}
		} else {
			// смотрим поочередно сессионные таблицы
			$timeStart = microtime(true);
			foreach (self::$sessionFRFMTables as $table=> $value) {
				// если очередная сессионная таблица есть в таблицах конфига, то
				if (isset($this->allowFRFMTables[$table])) {
					// если эта таблица есть в запросе, то frfm
					$pattern = '/[`\ ,]' . $table . '[`\ ,]/ui';
					if (preg_match($pattern, $query)) {
						$this->forcedReadingMaster = true;
						break;
					}
				}
			}
			self::$timeSpentOnFRFM += microtime(true) - $timeStart;

			if ($this->forcedReadingMaster) {
				$this->checkMasterConnect();
				$this->lastConnect = 1;
			} else {
				$this->checkSlaveConnect();
				$this->lastConnect = 2;
			}
		}

		if ($this->debug)
			$this->debug($arguments);

		if ($this->transaction || $this->forcedReadingMaster || $this->forcedReadingMasterInfinitely || PHP_SAPI == 'cli') {
			self::$numberOfRequests['select']['master'] += 1;
			$this->stmt = $this->masterConnect->prepare($query);
		} else {
			self::$numberOfRequests['select']['slave'] += 1;
			$this->stmt = $this->slaveConnect->prepare($query);
		}

		$this->forcedReadingMaster = false;

		if (!$this->stmt) {
			if ($this->debug)
				$this->debug();
			return false;
		}

		if (count($arguments) > 1) {
			$bindVars = $arguments;
			unset($bindVars[0]);
			$params = [];
			$binding = $this->bindParams($bindVars, $params);
			if (!$binding) {
				if ($this->debug)
					$this->debug();
				return false;
			}
		}

		$execute = $this->stmt->execute();
		if (!$execute) {
			if ($this->debug)
				$this->debug();
			return false;
		}

		$resVal = new lmMysqlResult($this->stmt);
		$this->lastNumRows = (!$resVal) ? false : (int) $resVal->numRows;
		return $resVal;
	}

	/**
	 * Функция для запросов UPDATE, DELETE, REPLACE
	 *
	 * @return true|false
	 */
	private function updateQuery()
	{
		$this->lastConnect = 1;

		$this->lastNumRows = false;

		$this->reconnectIfNeeded();

		if ($this->transaction) {
			if (!$this->masterConnect) {
				trigger_error('Connection is corrupted');
				return false;
			}

			$result = $this->masterConnect->query('SELECT @@autocommit AS value');
			if (!$result) {
				trigger_error("MYSQL ERROR during opened transaction: " . $this->masterConnect->error);
				return false;
			}

			$row = $result->fetch_assoc();
			if ($row['value'] == 1) {
				trigger_error("Connection has enabled autocommit during opened transaction");
				return false;
			}
		} else {
			if (!$this->checkMasterConnect())
				return false;
		}

		$arguments = func_get_args();
		$query = $arguments[0];

		if ($this->debug)
			$this->debug($arguments);

		$this->stmt = $this->masterConnect->prepare($query);
		if (!$this->stmt) {
			if ($this->debug)
				$this->debug();
			return false;
		}

		if (count($arguments) > 1) {
			$bindVars = $arguments;
			unset($bindVars[0]);
			$params = [];
			$binding = $this->bindParams($bindVars, $params);
			if (!$binding) {
				return false;
				if ($this->debug)
					$this->debug();
			}
		}

		if (!$this->stmt) {
			if ($this->debug)
				$this->debug();
			return false;
		}

		$execute = $this->stmt->execute();
		if (!$execute) {
			if ($this->debug)
				$this->debug();
			return false;
		}
		$this->insertId = $this->masterConnect->insert_id;
		$this->affectedRows = $this->masterConnect->affected_rows;

		// если действительно обновлялись данные, то пишем имена таблиц в сессию
		if ($this->affectedRows || $this->insertId) {
			$timeStart = microtime(true);
			$tables = self::getTablesFromQuery($query);
			foreach ($tables as $table) {
				if (isset($this->allowFRFMTables[$table])) {
					self::setSessionFRFMForTable($table);
					self::$sessionFRFMTables[$table] = 1;
				}
			}
			self::$timeSpentOnFRFM += microtime(true) - $timeStart;
			self::$numberOfRequests['update']['really'] += 1;
		} else {
			self::$numberOfRequests['update']['empty'] += 1;
		}

		return true;
	}

	/**
	 * Функция обработки плейсхолдеров
	 *
	 * @return true|false
	 */
	private function bindParams($bindVars, &$params)
	{
		$params[] = $this->getParamTypes($bindVars);
		foreach ($bindVars as $key => $param) {
			$params[] = &$bindVars[$key];
		}
		return call_user_func_array(array($this->stmt, 'bind_param'), $params);
	}

	/**
	 * Функция для генерации строки типов аргументов
	 *
	 * @return string
	 */
	private function getParamTypes($arguments)
	{
		unset($arguments[0]);
		$retval = '';
		foreach ($arguments as $arg) {
			$retval .= $this->getTypeByVal($arg);
		}
		return $retval;
	}

	/**
	 * Фукнция определения типа аргумента
	 *
	 * @return string
	 */
	private function getTypeByVal($variable)
	{
		switch (gettype($variable)) {
			case 'integer':
				$type = 'i';
				break;
			case 'double':
				$type = 'd';
				break;
			default:
				$type = 's';
		}
		return $type;
	}

	public function ping()
	{
		if ($this->lastConnect == 1) {
			return $this->masterConnect->ping();
		} elseif ($this->lastConnect == 2) {
			return $this->slaveConnect->ping();
		} else {
			return false;
		}
	}

	public function reconnect()
	{
		$this->masterConnect = false;
		$this->slaveConnect = false;
		$this->checkMasterConnect();
		$this->checkSlaveConnect();
	}

	/**
	 * Возвращает текст ошибки
	 *
	 * @return string
	 */
	public function error()
	{
		if ($this->lastConnect === 1) {
			return $this->masterConnect->error;
		} elseif ($this->lastConnect === 2) {
			return $this->slaveConnect->error;
		} else {
			return false;
		}
	}

	/**
	 * Возвращает код ошибки
	 *
	 * @return string
	 */
	public function errno()
	{
		if ($this->lastConnect == 1) {
			return $this->masterConnect->errno;
		} elseif ($this->lastConnect == 2) {
			return $this->slaveConnect->errno;
		} else {
			return false;
		}
	}

	public function restartConnections()
	{
		$this->checkMasterConnect();
		$this->checkSlaveConnect();
	}

	/**
	 * Деструктор
	 */
	public function __destruct()
	{
		if ($this->masterConnect)
			$this->masterConnect->close();
		if ($this->slaveConnect)
			$this->slaveConnect->close();
	}

	/**
	 * Определяет таблицы, присутствующие в запросе обновления (UPDATE, INSERT, REPLACE, DELETE).
	 * Корректно работает с 'правильными' запросами.
	 *
	 * @param string $query Строка запроса
	 * @return array|false Возвращает массив названий таблиц в случае успеха, false в противном случае
	 */
	private static function getTablesFromQuery($query)
	{

		$needles = array(' SET',' (', ' WHERE', ' SELECT', ' VALUES');
		foreach ($needles as $needle) {
			$pos = mb_stripos($query, $needle, 3);
			if ($pos > 0) {
				$query = mb_substr($query, 0, $pos);
				break;
			}
		}

		$pattern = '/(UPDATE |INSERT |REPLACE |DELETE )?(LOW_PRIORITY |DELAYED )?(IGNORE |QUICK )?(INTO |FROM )?(.+)/ui';
		preg_match($pattern, $query, $matches);
		if (isset($matches[5])) {
			$matches[5] = trim($matches[5]);
			$tables = explode(',', $matches[5]);
			$result = [];
			foreach ($tables as $table) {
				$table = trim($table);
				$table = explode(' ', $table);
				$table = $table[0];
				$table = trim($table, '`');
				$result[] = $table;
			}

			return $result;
		}

		return false;
	}

	/**
	 * Временный метод.
	 * Возвращает сообщение о статистике FRFM-операций
	 *
	 * @return string Строка сообщения
	 */
	public static function getMessageAboutFRFMStat()
	{
		$result = 'TESTING FRFM in lmMysql: ';
		if (self::$sessionFRFMTables) {
			$result .= 'Session tables: ' . implode(', ', array_keys(self::$sessionFRFMTables)) . '.';
		} else {
			$result .= 'No session tables.';
		}
		$result .= ' Time spent on FRFM-operation: ' . round(self::$timeSpentOnFRFM, 6) . ' seconds.';
		$numUpdateAll = self::$numberOfRequests['update']['really'] + self::$numberOfRequests['update']['empty'];
		$numSelectAll = self::$numberOfRequests['select']['master'] + self::$numberOfRequests['select']['slave'];
		$result .= ' Numbers of requests: select - ' . $numSelectAll . ' (master - ' . self::$numberOfRequests['select']['master'] . ', slave - ' . self::$numberOfRequests['select']['slave'] . ')';
		$result .= ', update - ' . $numUpdateAll . ' (really - ' . self::$numberOfRequests['update']['really'] . ', no affected - ' . self::$numberOfRequests['update']['empty'] . ')';
		return $result;
	}

	/**
	 * Метод множественной вставки строк
	 * самый замечательный коммит
	 *
	 * @param string $nameTable - имя таблицы
	 * @param array $nameFields - одномерный массив с названиями полей
	 * @param array $valueFields - двумерный массив значений
	 * @param bool $insertIgnore - используется ли в запросе директива IGNORE
	 *
	 * @return bool
	 */
	public function insertMultiple($nameTable, $nameFields, $valueFields, $insertIgnore = false)
	{
		$queryString = $this->getStringQueryForInsertMultiple($nameTable, $nameFields, $valueFields, $insertIgnore);
		if ($queryString === false) {
			return false;
		}

		return $this->query($queryString);
	}

	/**
	 * Метод формирует строковое представление запроса для множественной вставки в БД
	 *
	 * @param string $nameTable - имя таблицы
	 * @param array $nameFields - одномерный массив с названиями полей
	 * @param array $valueFields - двумерный массив значений
	 * @param bool $insertIgnore - используется ли в запросе директива IGNORE
	 * @return bool|string
	 */
	public function getStringQueryForInsertMultiple($nameTable, $nameFields, $valueFields, $insertIgnore = false)
	{
		return $this->getStringQueryForInsertOrReplaceMultiple($nameTable, $nameFields, $valueFields, 'INSERT', $insertIgnore);
	}

	/**
	 * Метод множественной замены строк
	 *
	 * @param string $nameTable - имя таблицы
	 * @param array $nameFields - одномерный массив с названиями полей
	 * @param array $valueFields - двумерный массив значений
	 *
	 * @return bool
	 */
	public function replaceMultiple($nameTable, $nameFields, $valueFields)
	{
		$queryString = $this->getStringQueryForReplaceMultiple($nameTable, $nameFields, $valueFields);
		if ($queryString === false) {
			return false;
		}

		return $this->query($queryString);
	}

	/**
	 * Метод формирует строковое представление запроса для множественной замены строк в БД
	 *
	 * @param string $nameTable - имя таблицы
	 * @param array $nameFields - одномерный массив с названиями полей
	 * @param array $valueFields - двумерный массив значений
	 * @return bool|string
	 */
	public function getStringQueryForReplaceMultiple($nameTable, $nameFields, $valueFields)
	{
		return $this->getStringQueryForInsertOrReplaceMultiple($nameTable, $nameFields, $valueFields, 'REPLACE');
	}

	/**
	 * Метод формирует строковое представление запроса для множественной вставки или замены строк в БД
	 *
	 * @param string $nameTable - имя таблицы
	 * @param array $nameFields - одномерный массив с названиями полей
	 * @param array $valueFields - двумерный массив значений
	 * @param string $operation - операция ('INSERT' или 'REPLACE')
	 * @param bool $insertIgnore - используется ли в запросе директива IGNORE
	 * @return bool|string
	 */
	private function getStringQueryForInsertOrReplaceMultiple($nameTable, $nameFields, $valueFields, $operation, $insertIgnore = false)
	{
		if ($operation != 'INSERT' && $operation != 'REPLACE') {
			return false;
		}
		if (!is_array($nameFields) || !is_array($valueFields) || count($nameFields) == 0 || count($valueFields) == 0) {
			return false;
		}

		$countFields = count($nameFields);
		$name = implode(', ', $nameFields);
		$values = $this->_getValuesForInsertMultiple($valueFields, $countFields);
		if ($values == false) {
			return false;
		}

		if ($insertIgnore) {
			$operation = $operation . ' IGNORE';
		}

		$queryString = $operation . " INTO `" . $nameTable . "` (" . $name . ") VALUES " . $values;

		return $queryString;
	}

	/**
	 * Метод формирует строковое представление конструкции VALUES для INSERT INTO или REPLACE INTO
	 *
	 * @param array $valueFields - двумерный массив значений
	 * @param array $countFields - количество полей
	 * @return array
	 */
	private function _getValuesForInsertMultiple($valueFields, $countFields)
	{
		$values = '';
		$i = 0;
		$countValueFields = count($valueFields);
		foreach ($valueFields as $valueField) {
			if (count($valueField) != $countFields) {
				return false;
			}
			$values .= '(';
			foreach ($valueField as $value) {
				$value = $this->realEscapeString($value);
				$values .= "'" . $value . "', ";
			}
			$values = mb_substr($values, 0, -2);
			if ($i + 1 < $countValueFields) {
				$values .= '), ';
			} else {
				$values .= ')';
			}
			$i++;
		}

		return $values;
	}

	/**
	 * Метод для закрытия инстанса lmmysql
	 *
	 * @param string $configname инстанс для закрытия
	 * @return bool результат закрытия lmmysql
	 */
	public static function close($configname = 'default')
	{
		if (is_string($configname) && isset(self::$instances[$configname])) {
			unset(self::$instances[$configname]);
			return true;
		}
		return false;
	}

	/**
	 * Метод обрабатывает результат запроса и если возникла ошибка - возвращает исключение
	 * Не использовать его для обработки результата fetchRow() !!!
	 *
	 * @param mixed $result - результат запроса к БД
	 * @param string $message - сообщение в случае ошибки
	 * @param int $flag - тип обработки результата
	 *
	 * @throws BaseException
	 *
	 * @return mixed $result - результат запроса к БД
	 */
	public function checkDBResult($result, $message = '', $flag = self::CHECK_DB_FLAG_RESULT)
	{
		BaseException::conditionThrow($result === false, BaseException::BASE_DB_ERROR, $message);

		if ($flag == self::CHECK_DB_FLAG_NOT_EMPTY_RESULT) {
			BaseException::conditionThrow(!count($result), BaseException::BASE_DB_EMPTY_RESULT_ERROR, $message . ' empty result');
		}

		if ($flag == self::CHECK_DB_FLAG_INSERT_ID) {
			return $this->insertId;
		}
		if ($flag == self::CHECK_DB_FLAG_AFFECTED_ROWS) {
			return $this->affectedRows;
		}

		return $result;
	}

	/**
	 * Метод-обертка для функции prepare(). Позволяет преподготавливать макет запроса для последующего выполнения
	 *
	 * @param string $query Макет запроса с указанными плейсхолдерами
	 * @param string $dataBase указание на подключение, которое следует использовать для преподготовки запросов
	 *
	 * @return object|false Oбъект запроса или false в случае ошибки.
	 */
	public function prepareQuery($query, $dataBase = 'master')
	{
		if (!$query) {
			$result = false;
		} else {
			if ($dataBase === 'master') {
				$connection = $this->masterConnect;
			} else {
				$connection = $this->slaveConnect;
			}
			if ($connection) {
				$result = $connection->prepare($query);
			} else {
				if ($dataBase === 'master') {
					$this->checkMasterConnect();
					$connection = $this->masterConnect;
				} else {
					$this->checkSlaveConnect();
					$connection = $this->slaveConnect;
				}
				$result = $connection->prepare($query);
			}
		}
		return $result;
	}

	/**
	 * Метод-обертка над функцией bind_param, определяет тип входных параметров и присваивает их указанному преподготовленному запросу
	 *
	 * @param object $stmt Объект преподготовленного запроса
	 * @param array $params Массив данных переменных для привязки к запросу $stmt
	 *
	 * @return bool Успешность привязки переменных
	 */
	public function bind_param($stmt, $params)
	{
		$result = false;

		if (is_array($params)) {
			$typesString = '';
			$paramsCount = count($params);
			if ($paramsCount === $stmt->param_count) {
				foreach ($params as $param) {
					$paramType = gettype($param);
					switch ($paramType) {
						case 'integer':
							$typesString .= 'i';
							break;
						case 'double':
							$typesString .= 'd';
							break;
						case 'resource':
							$typesString .= 'b';
							break;
						default:
							$typesString .= 's';
							break;
					}
				}
				$result = $stmt->bind_param($typesString, ...$params);//В качестве параметров для привязки передаем все элементы $params
			}
		}
		return $result;
	}

	/**
	 * Метод для вставки в таблицу с использованием преподготовленных запросов<br>
	 * В качестве передаваемых данных рекомендуется использовать массив, кратный либо больше указанного размера пачки, во избежание дополнительных действий при выполнении мультиинсерта<br>
	 * Ограничения для размера пачки указаны в константах<br>
	 *
	 * @param string $table Название таблицы для вставки
	 * @param array $fields Поля, которые заполняются во время вставки (одномерный массив)
	 * @param array $data Данные для вставки в таблицу (количество элементов в одном элементе должно соответствовать количеству полей, двумерный массив)
	 * @param bool $insertIgnore Флаг использования INSERT IGNORE
	 * @param int $pack Количество запросов, после когторого необходимо выполнять sleep
	 * @param array $odku Массив полей для использования в конструкции ON DUPLICATE KEY UPDATE (если не указаны, конструкция не используется)
	 * @param bool $debug Вывод сообщений о ходе выполнения операции
	 * @param int $usleep Время задержки между запросами в микросекундах
	 * @return bool
	 */
	public function insertWithPrepare(
		string $table,
		array $fields,
		array $data,
		bool $insertIgnore = false,
		int $pack = self::DEFAULT_PACK_FOR_INSERT,
		array $odku = [],
		bool $debug = false,
		int $usleep = 1000000
	): bool
	{
		/** Проверка установленного размера пачки на соотвествие ограничениям */
		if ($pack > self::MAX_PACK_FOR_INSERT || $pack <= 0) {
			$pack = self::DEFAULT_PACK_FOR_INSERT;
		}
		/** Проверка на содержание количества данных больше, чем размер пачки, иначе устанавливаем пачку под размер данных*/
		if (count($data) < $pack) {
			$pack = count($data);
		}
		$result = true;

		$query = $this->compileQueryForMultiInsert($table, $fields, $insertIgnore, $pack, $odku);
		$prepare = $this->prepareQuery($query);
		$paramsChunkedArray = array_chunk($data, $pack);

		$i = 0;
		$totalCount = 0;
		foreach ($paramsChunkedArray as $chunk) {
			$chunkCount = count($chunk);
			/** При размере данных не соответствующем пачке переподготавливаем запрос с учетом необходимого количества для вставки */
			if ($chunkCount !== $pack) {
				$prepare->close();
				$query = $this->compileQueryForMultiInsert($table, $fields, $insertIgnore, count($chunk), $odku);
				$prepare = $this->prepareQuery($query);
			}

			$k = 0;
			foreach ($chunk as $row) { //приводим входящий массив к индексному виду (для возможности использовать в качестве значений для вставки ассоциативные массивы)
				$chunk[$k] = array_values($row);
				$k++;
			}
			$bind = $this->bind_param($prepare, array_merge(...$chunk));//Привязываем переменные к преподготовленному запросу. В качестве данных для привязки выступает объединенный массив данных текущей пачки
			if (!$bind) {
				$result = false;
				break;
			} else {
				$prepare->execute();
				$totalCount += $prepare->affected_rows;
				if ($i % 100 == 0 && $debug ) {//каждые 100 итераций мультиинсерта выводим сообщение, если необходимо
					echo date('[Y-m-d_H:i:s]') . ' Inserted ' . $totalCount . ' entries total' . PHP_EOL;
				}
				usleep($usleep);
				$i++;
			}
		}
		if ($debug) {//финальные вывод, при необходимости
			echo date('[Y-m-d_H:i:s]') . ' Inserted ' . $totalCount . ' entries total' . PHP_EOL;
			if (!$result) {
				echo date('[Y-m-d_H:i:s]') . ' ERROR after Inserting ' . $totalCount . ' entries' . PHP_EOL;
			}
		}
		return $result;
	}

	/**
	 * Приватный метод для формирования запроса для подготовки мультиинсерта
	 *
	 * @param string $table Название таблицы для вставки
	 * @param array $fields Поля для вставки
	 * @param bool $insertIgnore Флаг использования INSERT IGNORE
	 * @param int $pack Количество строк для вставки в одном запросе
	 * @param array $odku Массив полей для использования в конструкции ON DUPLICATE KEY UPDATE (если не указаны, конструкция не используется)
	 * @return string
	 */
	private function compileQueryForMultiInsert(
		string $table,
		array $fields,
		bool $insertIgnore = false,
		int $pack = self::DEFAULT_PACK_FOR_INSERT,
		array $odku = []
	): string
	{
		$query = '';

		if ($table && $fields) {
			/** Формируем плейсхолдеры по количеству пришедших полей */
			$paramsPlaceholders = '';
			$numberOfParams = count($fields);
			for ($i = 0; $i < $numberOfParams; $i++) {
				if ($i === $numberOfParams - 1) {
					$paramsPlaceholders .= '?';
				} else {
					$paramsPlaceholders .= '?, ';
				}
			}
			/** Собираем основной запрос для подготовки */
			$q = 'INSERT ';
			if ($insertIgnore) {
				$q .= 'IGNORE ';
			}
			$valuesToInsert = '';
			for ($i = 1; $i <= $pack; $i++) {
				$valuesToInsert .= '(' . $paramsPlaceholders . ')';
				if ($i != $pack) {
					$valuesToInsert .= ', ';
				}
			}
			$query = $q . 'INTO ' . $table . ' (' . implode(', ', $fields) . ') VALUES ' .$valuesToInsert;
			/** Формируем и добавляем условвие ON DUPLICATE KEY UPDATE при наличии флага */
			if ($odku) {
				$condition = '';
				$flag = 1;
				$fieldsCount = count($odku);
				foreach ($odku as $field) {
					if ($this->insert_with_prepare_odku_type == self::INSERT_ODKU_EQUAL) {
						$condition .= $field . ' = ' . ' VALUES(' . $field . ')';
					} else {
						$condition .= $field . ' = ' . $field . ' + VALUES(' . $field . ')';
					}

					if ($flag !== $fieldsCount) {
						$condition .= ', ';
					}
					$flag++;
				}
				$query .= ' ON DUPLICATE KEY UPDATE ' . $condition;
			}
		}

		return $query;
	}
}
