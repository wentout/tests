<?php
	
	include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		$statePath = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'focus.txt';
		if(file_exists($statePath)){
			_remove($statePath);
		}
		$arr = array();
		$arr['model'] = file_get_contents($pages_path.'model.json');
		$arr['page'] = file_get_contents($pages_path.'page.txt');
		echo json_encode ($arr);
		file_put_contents($statePath, $_POST['leaf']);
	}

?>