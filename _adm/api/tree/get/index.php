<?php
	
	include(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	$statePath = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'state.txt';
	$state = '';
	if(file_exists($statePath)){
		$state = file_get_contents($statePath);
	}
	
	if($gonext){
		if ($dh = opendir($page_path)) {
			$arr = array();
			while (($entry = readdir($dh)) !== false) {
				if( $entry != "." && $entry != ".." ) {
					// folder open
					if($page_path !== $pages_path){
						if(strrpos($state, $page_path) === false){
							$state .= $page_path;
						}
					}
					if( is_dir( $page_path.$entry ) ) {
						$arr[$entry] = array(
							'folder' => false
						);
						if ($handleF = opendir($page_path.'/'.$entry)) {
							while (false !== ($entryF = readdir($handleF))) {
								if( $entryF != "." && $entryF != ".." ){
									if( is_dir( $page_path.'/'.$entry.'/'.$entryF) ) {
										$arr[$entry]['folder'] = true;
										// echo '>>'.$state.'||'.$page_path.$entry.'/';
										if(strrpos($state, $page_path.$entry.'/') !== false){
											$arr[$entry]['open'] = true;
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
			file_put_contents($statePath, $state);
			
			$order_path = $page_path.'/order.json';
			if(file_exists($order_path)){
				$order = json_decode(file_get_contents($order_path));
				
				var_dump($order);
				
			} else {
				echo json_encode ($arr);
			}
		}
	}

?>