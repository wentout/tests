<?php
	
	$statePath = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'focus.txt';
	if(file_exists($statePath)){
		readfile($statePath);
	} else {
		echo '"null"';
	}

?>