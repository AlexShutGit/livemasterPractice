<?php
//Task 2.
class Goods
{
	
	public function setGoods()
	{
		return [
		"jackets" => [
			0 => [
					"id" => "10001",
					"name" => "red jacket",
					"price" => 1500,
					"category" => "upper dress",
					"color" => "red",
					"amount" => "45",
				],
			1 => [
					"id" => "10002",
					"name" => "dolce jacketdolce jacketdolce jacketdolce jacketdolce jacketdolce jacketdolce jacketdolce jacketdolce jacketdolce jacketdolce jacketdolce jacket",
					"price" => 2600,
					"category" => "upper dress",
					"color" => "brown",
					"amount" => "30",
				],
			2 => [	
					"id" => "10003",
					"name" => "horse jacket",
					"price" => 15500,
					"category" => "upper dress",
					"color" => "brown",
					"amount" => "34",
				],
			],
		"pants" => [
			0 => [	
					"id" => "01001",
					"name" => "broadly pants",
					"price" => 5500,
					"category" => "pants",
					"color" => "brown",
					"amount" => "12",
				],
			1 => [	
					"id" => "01002",
					"name" => "skinny pants",
					"price" => 4200,
					"category" => "jeans",
					"color" => "brown",
					"amount" => "13",
				],
			2 => [	
					"id" => "01003",
					"name" => "classic pants",
					"price" => 10200,
					"category" => "pants",
					"color" => "red",
					"amount" => "27",
				],
			3 => [
					"id" => "01004",
					"name" => "casual pants",
					"price" => 8300,
					"category" => "jeans",
					"color" => "brown",
					"amount" => "20",
				],
			4 => [	
					"id" => "01005",
					"name" => "sport pantssport pantssport pantssport pantssport pantssport pantssport pantssport pantssport pantssport pantssport pantssport pantssport pantssport pants",
					"price" => 3300,
					"category" => "pants",
					"color" => "white",
					"amount" => "30",
				],
			],
		];
	}
	
	protected function amountJackets()
	{
		return count($this->setGoods()['jackets']);
	}
	
	protected function amountPants()
	{
		return count($this->setGoods()['pants']);
	}
	
	protected function comparisionAmount()
	{
		$amountJackets = $this->amountJackets();
		$amountPants = $this->amountPants();
		
		if ($amountJackets > $amountPants) {
			return $amountJackets;
		}
		return $amountPants;
	}
	
}

//$goo = new Goods;
//print_r($goo->setGoods());

//Task 3.a
class equalAmountGoods extends Goods
{
			
	private $amountJackets;
	private $amountPants;
	private $goods;
	
	private function getGoods()
	{
		$this->amountJackets = $this->amountJackets();
		$this->amountPants = $this->amountPants();
		$this->goods = $this->setGoods();
	}
	
	private function showAmountGoods()
	{
		echo ('кол-во Jackets: ' . $this->amountJackets . '.кол-во Pants: ' . $this->amountPants() . PHP_EOL);
		for ($i = 0; $i < $this->amountJackets; $i++) {
			echo ('id товаров jackets:' .$this->goods['jackets'][$i]['id'] . PHP_EOL);
		}
		for ($i = 0; $i < $this->amountPants; $i++) {
			echo ('id товаров pants:' .$this->goods['pants'][$i]['id'] . PHP_EOL);
		}
	}
	
	
	
	public function equalizationGoods()
	{
		$this->getGoods();
		$this->showAmountGoods();
		
		for ($i = 0; $i < $this->comparisionAmount(); $i++) {
			
			$this->amountJackets = count($this->goods['jackets']);
			$this->amountPants = count($this->goods['pants']);
			
			if ($this->amountJackets < $this->amountPants) {
				$lastItem = array_key_last($this->goods['jackets']);
				$last = ($this->goods['jackets'][$lastItem]);
				$lastItemid = $last['id']+1;
				$last['id'] = $lastItemid;

				$this->goods['jackets'] = $this->goods['jackets'] += [($lastItem + 1) => $last];
			} 
			
			if ($this->amountJackets > $this->amountPants) {
				$lastItem = array_key_last($this->goods['pants']);
				$last = ($this->goods['pants'][$lastItem]);
				$lastItemid = $last['id']+1;
				$last['id'] = $lastItemid;

				$this->goods['pants'] = $this->goods['pants'] += [($lastItem + 1) => $last];
			} 
		}
		$this->showAmountGoods();
	}
}

//$a = new equalAmountGoods;
//echo $a->equalizationGoods();


//Task 3.b,c
class onlyOneColorAndPrice extends Goods
{
	private $amountJackets;
	private $amountPants;
	private $goods;
	private $colored =[];
	private $hasNeedPrice = [];
	
	private function getGoods()
	{
		$this->amountJackets = $this->amountJackets();
		$this->amountPants = $this->amountPants();
		$this->goods = $this->setGoods();
	}
	
	private function showGoodsColor()
	{
		print_r($this->colored);
	}
	
	private function showGoodsPrice()
	{
		print_r($this->hasNeedPrice);
	}
	
	private function withPrice($price)
	{
		echo ('Максимальная цена: ' . $price . PHP_EOL);
		
		for ($i = 1; $i < count($this->colored)+1; $i++) {
			
			if ($this->colored[$i]['price'] < $price) {
				$this->hasNeedPrice += [($i) => $this->colored[$i]];
			}
		}
		$this->showGoodsPrice();
	}
	
	public function GoodsWithColor($needfulColor, $price)
	{
		$this->getGoods();
		
		for ($i = 0; $i < $this->amountJackets; $i++) {

			if ($this->goods['jackets'][$i]['color'] == $needfulColor) {
				$this->colored += [($i) => $this->goods['jackets'][$i]];
			} 
		} 
		
		for ($i = 0; $i < $this->amountPants; $i++) {
			
			$lastId = count($this->colored);
			
			if ($this->goods['pants'][$i]['color'] == $needfulColor) {
				$this->colored += [($lastId+1) => $this->goods['pants'][$i]];
			} 
		} 
		
		echo ('Заданный цвет поиска: ' . $needfulColor . PHP_EOL);
		
		$this->showGoodsColor();
		$this->withPrice($price);
	}
}

//$b = new onlyOneColorAndPrice;
//$b->GoodsWithColor('brown', 10000);

//Task 3.d
class MaxAmountChar extends Goods
{
	private $amountJackets;
	private $amountPants;
	private $goods;
	
	private function getGoods()
	{
		$this->amountJackets = $this->amountJackets();
		$this->amountPants = $this->amountPants();
		$this->goods = $this->setGoods();
	}
	
	private function showСorrected()
	{
		print_r($this->goods);
	}
	
	public function maxChar()
	{
		$this->getGoods();
		for ($i = 0; $i < $this->amountJackets; $i++) {
			
			if (strlen($this->goods['jackets'][$i]['name']) > 130) {
				$str = $this->goods['jackets'][$i]['name'];
				$this->goods['jackets'][$i]['name'] = mb_strimwidth($str, 0, 133, '...');
			} 
		}
		for ($i = 0; $i < $this->amountPants; $i++) {
			
			if (strlen($this->goods['pants'][$i]['name']) > 130) {
				$str = $this->goods['pants'][$i]['name'];
				$this->goods['pants'][$i]['name'] = mb_strimwidth($str, 0, 133, '...');
			} 
		}
		$this->showСorrected();
	}
}

//$c = new MaxAmountChar;
//$c->maxChar();

//Task 4.b
class DeliveryDate extends Goods
{
	private $amountJackets;
	private $amountPants;
	private $goods;
	
	private function getGoods()
	{
		$this->amountJackets = $this->amountJackets();
		$this->amountPants = $this->amountPants();
		$this->goods = $this->setGoods();
	}
	
	public function setDate()
	{
		$this->getGoods();
		
		for ($i = 0; $i < $this->amountJackets; $i++) {
			$randDate = rand(1,10);
			$dateDelivery = date("Y-m-d", strtotime("+" . $randDate . "days"));

			$this->goods['jackets'][$i]['dateDelivery'] = $dateDelivery;
		}	
		
		for ($i = 0; $i < $this->amountPants; $i++) {
			$randDate = rand(1,10);
			$dateDelivery = date("Y-m-d", strtotime("+" . $randDate . "days"));

			$this->goods['pants'][$i]['dateDelivery'] = $dateDelivery;
		}
		
		print_r($this->goods);
	}
	
}

//$d = new DeliveryDate;
//$d-> setDate();

//Task 4.f
class addNewItem extends Goods
{
	private $amountJackets;
	private $amountPants;
	private $goods;
	
	private function getGoods()
	{
		$this->amountJackets = $this->amountJackets();
		$this->amountPants = $this->amountPants();
		$this->goods = $this->setGoods();
	}
	
	public function addNewItem($category,$newItem)
	{
		$this->getGoods();
		
		if (array_key_exists($category, $this->goods)) {
			$newId = (array_key_last($this->goods[$category]) + 1);
			$this->goods[$category][$newId] = $newItem;
		}
		print_r($this->goods);
	}
}

$newItem = [
			"id" => 00123,
			"name" => "best jaguar",
			"price" => 18900,
			"category" => "shirt",
			"color" => "black",
			"amount" => 13,  
		];

//$e = new addNewItem;
//$e->addNewItem('jackets',$newItem);
