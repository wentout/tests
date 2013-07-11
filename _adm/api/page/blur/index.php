<?php
	
	include_once(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'common.php');
	
	$statePath = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'focus.txt';
	_remove($statePath);
	echo json_encode(array(
		'success' => true
	));

?>