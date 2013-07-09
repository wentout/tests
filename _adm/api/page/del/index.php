<?php
	
	include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		if(file_exists($pages_path) && is_dir($pages_path)){
			_remove($pages_path);
		}
		echo '{"success":true}';
	}

?>