<?php
	
	include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		
		if(isset($_POST['name'])){
			$name = $_POST['name'];
			
			rename($page_path, dirname($page_path).'/'.$name);
			
			$order_path = dirname($page_path).'/order.json';

			if(file_exists($order_path)){
				$order = file_get_contents($order_path);
				@file_put_contents( $order_path, str_replace( '"'.basename($page_path).'"', '"'.$name.'"', $order ) );
			}
		
			echo json_encode(array(
				'success' => true
			));

		}
	}

?>