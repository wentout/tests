<?php
	
	include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		
		if(file_exists($pages_path)){
			$statePath = $pages_path.'/focus.txt';
			if(file_exists($statePath)){
				_remove($statePath);
			}
			$arr = array();
			$arr['model'] = file_get_contents($page_path.'model.json');
			$arr['page'] = file_get_contents($page_path.'page.txt');
			echo json_encode ($arr);
			file_put_contents($statePath, $_POST['leaf']);
		} else {
			echo json_encode(array(
				'success' => false
			));
		}
		
	}

?>