<?php
	
	mb_internal_encoding("UTF-8");
	
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

	function read_options() {
		$settings_path = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'options'.DIRECTORY_SEPARATOR.'options.json';
		$str = file_get_contents($settings_path);
		$dt = get_object_vars(json_decode($str));
		$dt['perm_files'] = intval($dt['perm_files'], 8);
		$dt['perm_folder'] = intval($dt['perm_folder'], 8);
		return $dt;
	};
	
	$options = read_options();
	$perm_folder = $options['perm_folder'];
	
	$root = $_SERVER["DOCUMENT_ROOT"].'/';
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
	
	/*
	if( file_exists($pagePath) ) {
		
	}

	if( file_exists($pagePath) && is_dir($pagePath) ) {
		if( isset( $_POST['action'] ) ){
			$action = $_POST['action']; 
			if( isset( $_POST['leaf'] ) ){
				$leaf = json_decode($_POST['leaf']);
				
				
				
			}
		}
	}

	function nameU( $str ){
		include dirname(__FILE__).DIRECTORY_SEPARATOR.'settings.php';
		return mb_convert_encoding($str, $fileNameEncoding, "UTF-8");
	};
	function nameS( $str ){
		include dirname(__FILE__).DIRECTORY_SEPARATOR.'settings.php';
		return mb_convert_encoding($str, "UTF-8", $fileNameEncoding);
	};

	function paths( $leaf ){
		include dirname(__FILE__).DIRECTORY_SEPARATOR.'settings.php';
		$pages = $pages;
		$pagesPath = dirname( dirname(__FILE__) ).preg_replace( '/\/top/' , DIRECTORY_SEPARATOR.$pages , nameU( $leaf ), 1 );
		return $pagesPath;
	};

	// to get entire tree
	if( $action == 'get' ){
		$pagesPath = paths( $leaf );
		if ($handle = opendir($pagesPath)) {
			$arr = array();
			while (false !== ($entry = readdir($handle))) {
				if( $entry != "." && $entry != ".." ){
					if( is_dir( $pagesPath.DIRECTORY_SEPARATOR.$entry) ){
						$entry = nameS( $entry );
						$arr[]["name"] = $entry;
						if ($handleF = opendir($pagesPath.DIRECTORY_SEPARATOR.$entry)) {
							while (false !== ($entryF = readdir($handleF))) {
								if( $entryF != "." && $entryF != ".." ){
									if( is_dir( $pagesPath.DIRECTORY_SEPARATOR.$entry.DIRECTORY_SEPARATOR.$entryF) ){
										$arr[count($arr)-1]["folder"] = true;
										break;
									}
								}
							}
						}
					}
				}
			}
			echo json_encode ($arr);
			closedir($handle);
		}
	}

		
	function getPage( $pagePath ){
		if (file_exists($pagePath) && is_dir($pagePath)) {
			$success = array();
			$success['page'] = array();
			$success['page']['header'] = $headerContent;
			$success['page']['content'] = ''.getfiles( 'content.txt', $pagePath );
			$success['page']['info'] = ''.getfiles( 'info.txt', $pagePath );
			$success['page']['blocks'] = ''.getfiles( 'blocks.txt', $pagePath );
			$success['status'] = true;
			echo json_encode ($success);			
		}
	}

	if( $action == 'content_set' ){
		$pagePath = paths( $leaf );
		setPage( $pagePath , $data );
	}
	
	*/

?>