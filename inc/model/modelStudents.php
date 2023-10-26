<?php

namespace Model;

class modelPractice extends Model 
{
public function construct() {
        // подключаюсь к бд
        $this->conn = new mysqli("localhost", "username", "password", "database");
        if ($this->conn->connect_error) {
            die("Ошибка подключения к базе данных: " . $this->conn->connect_error);
        }
    }

    $FIO = $POST ['full_name'];
    $male = $POST ['sex'];
    $phone = $POST ['phone_number'];
    $email = $POST ['email'];
    $curse = $POST ['curse'];

public function saveData($FIO, $male, $phone, $email, $curse ) {
                        // показывую какие значения мне нужны и куда их вставить
    $sql = $this->conn->prepare("INSERT INTO newStudents (full_name, sex, phone_number, email, curse) VALUES ($FIO, $male, $phone, $email, $curse)");

    // Выполнение запроса
    if ($sql->execute()) {
        return true;
    } else {
        return false;
    }
}
}

}