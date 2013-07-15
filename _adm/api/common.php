<?php
	
	// @setlocale(LC_ALL, '');
	// @mb_internal_encoding("UTF-8");

	$root = $_SERVER['DOCUMENT_ROOT'];
	
	function _remove($rempath){
		if (!is_dir($rempath)) {
			if (!@unlink($rempath)) {
				die('Unable to remove file '.$rempath);
			}
		} else {
			$ls = scandir($rempath);
			for ($i=0; $i < count($ls); $i++) {
				if ('.' != $ls[$i] && '..' != $ls[$i]) {
					_remove($rempath.DIRECTORY_SEPARATOR.$ls[$i]);
				}
			}
			if (!@rmdir($rempath)) {
				die('Unable to remove file '.$rempath);
			}
		}
		return true;
	}

	function read_options($root) {
		$settings_path = $root.'_adm/options/options.json';
		$str = file_get_contents($settings_path);
		$dt = get_object_vars(json_decode($str));
		$dt['perm_files'] = intval($dt['perm_files'], 8);
		$dt['perm_folder'] = intval($dt['perm_folder'], 8);
		return $dt;
	};
	
	$options = read_options($root);
	$perm_folder = $options['perm_folder'];
	$perm_files = $options['perm_files'];
	
	$pages_path = $root.$options['pages_path'];
	
	if( file_exists($pages_path) ) {
		if( is_dir($pages_path) ) {
			$pages_path = $pages_path.'/';
		} else {
			_remove($pages_path);
			mkdir( $pages_path , $perm_folder ) or die ( '{"error":"Can\'t create pages path."}' );
		}
	} else {
		mkdir( $pages_path , $perm_folder ) or die ( '{"error":"Can\'t create pages path."}' );
	}

?>