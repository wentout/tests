<?php
	
	include(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		if ($dh = opendir($pages_path)) {
			$arr = array();
			while (($entry = readdir($dh)) !== false) {
				if( $entry != "." && $entry != ".." ){
					if( is_dir( $pages_path.$entry ) ){
						$arr[$entry] = array(
							'folder' => false
						);
						if ($handleF = opendir($pages_path.'/'.$entry)) {
							while (false !== ($entryF = readdir($handleF))) {
								if( $entryF != "." && $entryF != ".." ){
									if( is_dir( $pages_path.'/'.$entry.'/'.$entryF) ){
										$arr[$entry]['folder'] = true;
										break;
									}
								}
							}
						}
					}
				}
			}
			closedir($dh);
			echo json_encode ($arr);
		}
	}

?>