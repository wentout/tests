<?php
	
	include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		
		if(isset($_POST['name'])){
			$name = $_POST['name'];
			
			rename($pages_path, dirname($pages_path).'/'.$name);
			// echo dirname($pages_path);
		
			echo json_encode(array(
				'success' => true
			));

		}
	}

?>