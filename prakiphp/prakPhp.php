<?php

// 1. Task
	$good = [
		"id" => 00001,
		"name" => "jacket",
		"price" => 1500,
		"category" => "dress",
		"color" => "red",
		"amount" => "50",
		];
		
	//print_r($good);
	
// 2. Task	
	$goods = [
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
	
	// 3.a Task
	function equalAmountGoods($goods)
	{	
		echo (PHP_EOL);
		echo ('Задание 3.а ------------' . PHP_EOL);
		echo (PHP_EOL);
 		$amountJackets = count($goods['jackets']);
		$amountPants = count($goods['pants']);
		$length = 1;
		
		if ($amountJackets > $amountPants ) {
			$length = $amountJackets;
		} $length = $amountPants; 
		
		echo ('кол-во Jackets до: ' . $amountJackets . '.кол-во Pants до: ' . $amountPants . PHP_EOL);
		for ($i = 0; $i < $amountJackets; $i++) {
			echo ('id товаров jackets до:' .$goods['jackets'][$i]['id'] . PHP_EOL);
		}
		for ($i = 0; $i < $amountPants; $i++) {
			echo ('id товаров pants до:' .$goods['pants'][$i]['id'] . PHP_EOL);
		}
		
		
		for ($i = 0; $i < $length; $i++) {
			$amountJackets = count($goods['jackets']);
			$amountPants = count($goods['pants']);
			
			if ($amountJackets < $amountPants) {
				$lastItem = array_key_last($goods['jackets']);
				$last = ($goods['jackets'][$lastItem]);
				$lastItemid = $last['id']+1;
				$last['id'] = $lastItemid;

				$goodsNewJackets = $goods['jackets'] += [($lastItem + 1) => $last];
				$goods['jackets'] =  $goodsNewJackets;
				} 
				
			if ($amountJackets > $amountPants) {
				$lastItem = array_key_last($goods['pants']);
				$last = ($goods['pants'][$lastItem]);
				$lastItemid = $last['id']+1;
				$last['id'] = $lastItemid;

				$goodsNewPants = $goods['pants'] += [($lastItem + 1) => $last];
				$goods['pants'] =  $goodsNewPants;
				} 	
		}
		
		$amountJackets = count($goods['jackets']);
		$amountPants = count($goods['pants']);
		
		echo ('кол-во Jackets после: ' . $amountJackets . '.кол-во Pants после: ' . $amountPants . PHP_EOL);
		for ($i = 0; $i < $amountJackets; $i++) {
			echo ('id товаров jackets до:' .$goods['jackets'][$i]['id'] . PHP_EOL);
		}
		for ($i = 0; $i < $amountPants; $i++) {
			echo ('id товаров pants до:' .$goods['pants'][$i]['id'] . PHP_EOL);
		}
	}
	
	equalAmountGoods($goods);
	
	//3.b,c Task
	
	function onlyOneColorAndPrice($goods) 
	{
		echo (PHP_EOL);
		echo ('Задание 3.b ------------' . PHP_EOL);
		echo (PHP_EOL);
		
		
		$needfulColor = 'brown'; //<---задаем цвет
		$colored = [];
		$amountJackets = count($goods['jackets']);
		$amountPants = count($goods['pants']);
		
		for ($i = 0; $i < $amountJackets; $i++) {

			if ($goods['jackets'][$i]['color'] == $needfulColor) {
				$colored += [($i) => $goods['jackets'][$i]];
			} 
		} 
		
		for ($i = 0; $i < $amountPants; $i++) {
			$lastId = count($colored);
			if ($goods['pants'][$i]['color'] == $needfulColor) {
				$colored += [($lastId+1) => $goods['pants'][$i]];
			} 
		} 
		
		echo ('Заданный цвет поиска: ' . $needfulColor . PHP_EOL);
		print_r($colored);
		
		echo (PHP_EOL);
		echo ('Задание 3.c ------------' . PHP_EOL);
		echo (PHP_EOL);
		
		$hasNeedPrice = [];
		$maxPrice = 10000; //<----Задаем максимальную цену
		echo ('Максимальная цена: ' . $maxPrice . PHP_EOL);
		$length = count($colored);
		
		for ($i = 1; $i < $length+1; $i++) {
			if ($colored[$i]['price'] < $maxPrice) {
				$hasNeedPrice += [($i) => $colored[$i]];
			}
		} print_r($hasNeedPrice);
	}
	
	onlyOneColorAndPrice($goods);
	
	// 3.d Task
	
	function maxAmountChar($goods)
	{
		echo (PHP_EOL);
		echo ('Задание 3.d ------------' . PHP_EOL);
		echo (PHP_EOL);	
		
		$newName = [];
		$amountJackets = count($goods['jackets']);
		$amountPants = count($goods['pants']);
		
		for ($i = 0; $i < $amountJackets; $i++) {
			$count = $goods['jackets'][$i]['name'];
			
			if (strlen($count) > 130) {
				$str = $goods['jackets'][$i]['name'];
				$goods['jackets'][$i]['name'] = mb_strimwidth($str, 0, 133, '...');
			} 
		}
		for ($i = 0; $i < $amountPants; $i++) {
			$count = $goods['pants'][$i]['name'];
			
			if (strlen($count) > 130) {
				$str = $goods['pants'][$i]['name'];
				$goods['pants'][$i]['name'] = mb_strimwidth($str, 0, 133, '...');
			} 
		}	
			
		$newName = $goods;
		print_r($newName);
		 
	}
	
	maxAmountChar($goods);
	
	// 4.b Task
	
	function deliveryDate($goods)
	{
		echo (PHP_EOL);
		echo ('Задание 4.b ------------' . PHP_EOL);
		echo (PHP_EOL);	
		
		$amountJackets = count($goods['jackets']);
		$amountPants = count($goods['pants']);
		
		for ($i = 0; $i < $amountJackets; $i++) {
			$randDate = rand(1,10);
			$dateDelivery = date("Y-m-d", strtotime("+" . $randDate . "days"));

			$goods['jackets'][$i]['dateDelivery'] = $dateDelivery;
		}	
		
		for ($i = 0; $i < $amountPants; $i++) {
			$randDate = rand(1,10);
			$dateDelivery = date("Y-m-d", strtotime("+" . $randDate . "days"));

			$goods['pants'][$i]['dateDelivery'] = $dateDelivery;
		}
		
		print_r($goods);
	}
	
	deliveryDate($goods);

	// 4.f Task
	
	function addNewItem($goods)
	{
		echo (PHP_EOL);
		echo ('Задание 4.f ------------' . PHP_EOL);
		echo (PHP_EOL);
		
		$mainCatefory = "jackets"; //<----задаем основую категорию
		
		// ---- задаем параметры нового товара----
		$newItem = [
			"id" => 00123,
			"name" => "best jaguar",
			"price" => 18900,
			"category" => "shirt",
			"color" => "black",
			"amount" => 13,  
		];
		
		$amountJackets = count($goods['jackets']);
		$amountPants = count($goods['pants']);
		
		
		if (array_key_exists('jackets',$goods)) {
			$newId = (array_key_last($goods['jackets']) + 1);
			$goods['jackets'][$newId] = $newItem;
		}
		print_r($goods);
	}	
	
	addNewItem($goods);
	
	
	