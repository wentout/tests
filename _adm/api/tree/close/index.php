<?php
	
	include(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){

		$state = $page_path.'/open.txt';
		if(file_exists($state)){
			_remove($state);
		}
		
		echo json_encode(array(
			'success' => true
		));
		
	}

?>