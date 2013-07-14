<?php
	
	include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		if(file_exists($page_path) && is_dir($page_path)){
			_remove($page_path);
		}
		echo json_encode(array(
			'success' => true
		));
	}

?>