<?php
	
	include_once(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'common.php');
	
	$statePath = $pages_path.'/focus.txt';
	if(file_exists($statePath)){
		_remove($statePath);
	}
	
	echo json_encode(array(
		'success' => true
	));

?>