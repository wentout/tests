<?php
	
	include(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');

	$gonext = false;
	$page_path = $pages_path;
	if( isset( $_POST['leaf'] ) ){
		$leaf = json_decode($_POST['leaf']);
		if( isset( $leaf[0] ) ){
			if( $leaf[0] == 'top' ){
				if( count($leaf) > 1){
					$page_path = $pages_path.implode('/', array_slice($leaf, 1)).'/';
				}
				$gonext = true;
			}
		}
	}
	
?>