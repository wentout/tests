<?php
	
	include(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		if ($dh = opendir($page_path)) {
			$arr = array();
			while (($entry = readdir($dh)) !== false) {
				if( $entry != "." && $entry != ".." ) {
					if( is_dir( $page_path.$entry ) ) {
						$fname = basename($page_path.'/'.$entry);
						$arr[$fname] = array(
							'folder' => false
						);
						if ($handleF = opendir($page_path.'/'.$entry)) {
							while (false !== ($entryF = readdir($handleF))) {
								if( $entryF != "." && $entryF != ".." ){
									
									if( is_dir( $page_path.'/'.$entry.'/'.$entryF ) ) {
										$arr[$fname]['folder'] = true;
										
										$state_path = $page_path.$entry.'/open.txt';
										$arr[$fname]['state'] = $state_path;
										if(file_exists($state_path)){
											$arr[$fname]['open'] = true;
										}
										
										break;
										
									}
								}
							}
						}
					}
				}
			}
			closedir($dh);
			
			$state_path = $page_path.'/open.txt';
			file_put_contents($state_path, '');

			$order_path = $page_path.'/order.json';
			if(file_exists($order_path)){
				
				$order = json_decode(file_get_contents($order_path));
				$pre = array();
				
				foreach ($order as $value) {
					$pre[$value] = $value;
				}
				
				$result = array_merge($pre, $arr);
				// var_dump($result);
				
				$orders = array();
				$stack = array();
				foreach ($result as $key => $value) {
					if(is_array($value)){
						$stack[$key] = $value;
						array_push($orders, $key);
					}
				}
				
				echo json_encode ($stack);
				@file_put_contents( $order_path, json_encode ($orders) );
				
			} else {
				echo json_encode ($arr);
			}
		}
	}

?>