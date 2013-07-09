<?php
	
	include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		$arr = array();
		$arr['model'] = file_get_contents($pages_path.'model.json');
		$arr['page'] = file_get_contents($pages_path.'page.txt');
		echo json_encode ($arr);
	}

?>