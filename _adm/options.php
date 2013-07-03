<?php
	
	$path = dirname(__FILE__).DIRECTORY_SEPARATOR.'options.json';
	
	if( isset( $_POST['action'] ) ){ $action = $_POST['action']; }
	
	if( $action == 'get' ){
		readfile($path);
	}

	if( ( $action == 'set' )){
		if( isset( $_POST['data'] ) ){
			$data = $_POST['data']; 
			$fh = fopen($path, 'w') or die("can't open file");
			fwrite($fh, $data);
			readfile($path);
		}
	}
	
?>