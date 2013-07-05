<?php
	
	// mb_internal_encoding("UTF-8");

	$root = $_SERVER["DOCUMENT_ROOT"];
	
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
		$root = $_SERVER["DOCUMENT_ROOT"];
		$settings_path = $root.'_adm/options/options.json';
		$str = file_get_contents($settings_path);
		$dt = get_object_vars(json_decode($str));
		$dt['perm_files'] = intval($dt['perm_files'], 8);
		$dt['perm_folder'] = intval($dt['perm_folder'], 8);
		return $dt;
	};
	
	$options = read_options();
	$perm_folder = $options['perm_folder'];
	
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

	if( isset( $_POST['leaf'] ) ){
		$leaf = json_decode($_POST['leaf']);
		if( isset( $leaf[0] ) ){
			if( $leaf[0] == 'top' ){
				if( count( $leaf) == 1){
					// echo '{"error":"no_data"}';
				}
			
				if ($dh = opendir($pages_path)) {
					$arr = array();
					while (($entry = readdir($dh)) !== false) {
						if( $entry != "." && $entry != ".." ){
							if( is_dir( $pages_path.$entry ) ){
								$entry = mb_convert_encoding($entry, 'UTF-8', 'UTF-8');
								echo $entry;
								// $arr[$entry.name] = array(
									// 'folder' => false
								// );
								// // if ($handleF = opendir($pages_path.'/'.$entry)) {
									// // while (false !== ($entryF = readdir($handleF))) {
										// // if( $entryF != "." && $entryF != ".." ){
											// // if( is_dir( $pages_path.'/'.$entry.'/'.$entryF) ){
												// // $arr[$entry]['folder'] = true;
												// // break;
											// // }
										// // }
									// // }
								// // }
							}
						}
					}
					closedir($handle);
					echo json_encode (array_keys($arr));
				}
			
			}
		}
	}
	
	/*
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
			closedir($handle);
			echo json_encode ($arr);
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