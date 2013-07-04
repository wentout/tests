<?php

	$path = dirname(__FILE__).DIRECTORY_SEPARATOR.'options.json';
	$path_backup = dirname(__FILE__).DIRECTORY_SEPARATOR.'_options.json';

	function read_options($str, $convert){
		if( !isset($str) ){
			$str = file_get_contents($path);
		}
		$dt = get_object_vars(json_decode($str));
		if( isset($convert) ){
			$dt['perm_files'] = intval($dt['perm_files'], 8);
			$dt['perm_folder'] = intval($dt['perm_folder'], 8);
		}
		return $dt;
	};

	if( isset( $_POST['action'] ) ){
		$action = $_POST['action'];
	}

	if ( $action == 'get' ) {
		readfile($path);
	}

	if ( $action == 'set' ) {
		if( isset( $_POST['data'] ) ){
			
			$data = ''.$_POST['data'];

			// reading previous opts
			$bopts = file_get_contents($path);
			$dt = read_options($bopts, true);
			
			// backing them up
			$fh = fopen($path_backup, 'w') or die("can't open file");
			fwrite($fh, $bopts);
			@chmod( $fh, $dt['perm_files'] );
			fclose($fh);

			// writing new opts
			$fh = fopen($path, 'w') or die("can't open file");
			fwrite($fh, $data);
			@chmod( $fh, $dt['perm_files'] );
			fclose($fh);
			
			// response check all right
			readfile($path);
			
		}
	}

?>