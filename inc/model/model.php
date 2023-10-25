<?php

// include 'model.class.php'
namespace Model;
use Provider\LmMysql;

class modelPractice extends Model 
{
   
        private $conn;
    
        public function __construct() {
            // подключаюсь к бд
            $this->conn = new mysqli("localhost", "username", "password", "database");
            if ($this->conn->connect_error) {
                die("Ошибка подключения к базе данных: " . $this->conn->connect_error);
            }
        }
        
        $FIO = $__POST ['name'];
        $male = $__POST ['male'];
        $phone = $__POST ['phone'];
        $email = $__POST ['email'];
        $curse = $__POST ['curse'];
    
        public function saveData($FIO, $male, $phone, $email, $curse ) {
                                // показывую какие значения мне нужны и куда их вставить
            $sql = $this->conn->prepare("INSERT INTO newStudents (FIO, male, phone, email, curse) VALUES ($FIO, $male, $phone, $email, $curse)");
    
            // Выполнение запроса
            if ($sql->execute()) {
                return true;
            } else {
                return false;
            }
        }
    
    
    
    
    
    ?>
}

