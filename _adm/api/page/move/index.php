<?php
	
	include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		
		if(isset($_POST['move'])){
			
			$move = json_decode($_POST['move']);
			$move_path = null;
			if( isset( $move[0] ) ){
				if( $move[0] == 'top' ){
					if( count($move) > 1){
						$move_path = $pages_path.implode('/', array_slice($move, 1)).'/';
					}
				}
			}
			
			$move_to_path = $page_path.$move[count($move) - 1];
			if (rename($move_path, $move_to_path)) {
				echo json_encode(array(
					'success' => true
				));
			} else {
				echo json_encode(array(
					'success' => false
				));
			}

		}
	}

?>