<?php
	
	include_once(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'common.php');
	
	
	$statePath = $pages_path.'/focus.txt';
	if(file_exists($statePath)){
		readfile($statePath);
	} else {
		echo '"null"';
	}
	

?>