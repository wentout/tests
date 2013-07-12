<?php

	$path = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'options.json';
	if(file_exists($path)){
		readfile($path);
	} else {
		echo '"{}"';
	}

?>