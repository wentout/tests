<?php
	
	include(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){

		$statePath = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'state.txt';
		if(file_exists($statePath)){
			$state = file_get_contents($statePath);
			if(strrpos($state, $page_path) !== false){
				$arr = explode($page_path, $state, 10000);
				if($arr){
					_remove($statePath);
					$str = '';
					foreach ($arr as &$value) {
						if(strrpos($value, $pages_path) !== false){
							$intarr = explode($pages_path, $value, 10000);
							$cnt = count($intarr);
							for ($i = 1; $i <= $cnt; $i++) {
								$elstr = $pages_path.$intarr[$i];
								if($elstr !== $pages_path){
									$str .= $elstr;
								}
							}
						}
					}
					$state = $str;
					file_put_contents($statePath, $state);
				}
			}
			echo json_encode(array(
				'success' => true
			));
		}
		
	}

?>