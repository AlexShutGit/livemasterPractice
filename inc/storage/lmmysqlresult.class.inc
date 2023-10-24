<?php

namespace Storage;

/**
 * Класс работы с результатом запроса
 */
class LmMysqlResult
{
	private $stmt = null;
	private $data = [];
	public $numRows = null;

	public function __construct($stmt)
	{
		$this->stmt = $stmt;
		$this->bindResult();
	}

	private function bindResult()
	{
		$var = [];
		$this->stmt->store_result();
		$this->numRows = $this->stmt->num_rows;
		$meta = $this->stmt->result_metadata();
		while ($field = $meta->fetch_field()) {
			$var[] = &$this->data[$field->name];
		}
		return call_user_func_array(array($this->stmt, 'bind_result'), $var);
	}

	public function fetchAssoc()
	{
		if ($this->stmt->fetch()) {
			$data = [];
			foreach ($this->data as $key => $value) {
				$data[$key] = $value;
			}
			return $data;
		} else {
			return false;
		}
	}

	public function fetchFirstField()
	{
		$result = $this->fetchAssoc();
		if ($result) {
			$result = array_values($result);
			return $result[0];
		} else {
			return null;
		}
	}

	/**
	 * Перемещает указатель результата на выбранную строку
	 * Эта функция может быть использована только с буферизованными результатами
	 *
	 * @param int $offset Смещение. Должно быть между нулем и числом строк в результате минус один
	 * @return bool
	 */
	public function dataSeek($offset = 0)
	{
		$offset = $offset < 0 ? 0 : $offset;
		$this->stmt->data_seek($offset);

		return true;
	}

	public function __destruct()
	{
		$this->stmt->close();
	}
}