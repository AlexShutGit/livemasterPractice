<?php

// Task 1.C


class User
{
	private $name = 'Alex';
	private $email = 'alex$gmail.com';
	
	public function getName()
	{
		return $this->name;
	}
	
	public function getEmail()
	{
		return $this->email;
	}
}

$user = new User;
echo $user->getName() . PHP_EOL;
echo $user->getEmail() . PHP_EOL;

// Task 2.1

class User
{
	private $name = 'Alex';
	private $email = 'alex$gmail.com';
	
	public function getName()
	{
		return $this->name;
	}
	
	public function getEmail()
	{
		return $this->email;
	}
}

class Buyer extends User
{
	public function buy()
	{
		return $this->getName() . 'Buyer';
	}
}

class Seller extends User
{
	public function sell()
	{
		return $this->getName() . 'Seller';
	}
}

$buy = new Buyer;
$sell = new Seller;
echo $buy->buy() . PHP_EOL;
echo $sell->sell() . PHP_EOL;

// Task 3.

interface IUser 
{
	public function getName();
	
	public function getEmail();

}

class Buyer implements IUser 
{
		public function getName()
	{
		return 'Alex';
	}
	
	public function getEmail()
	{
		return 'alex@gmail.com' ;
	}
}

class Seller implements IUser 
{
		public function getName()
	{
		return 'Lucas';
	}
	
		public function getEmail()
	{
		return 'Lucas@gmail.com' ;
	}
}

class StaticFactory
{
	public static function factory($userName)
	{
		if ($userName == 'Alex') {
			$buyer = new Buyer();
			echo $buyer->getName() . PHP_EOL;
			echo $buyer->getEmail() . PHP_EOL;
		}
		if ($userName == 'Lucas') {
			$seller = new Seller();
			echo $seller->getName() . PHP_EOL;
			echo $seller->getEmail() . PHP_EOL;
		}
	}
}

StaticFactory::factory('Alex');