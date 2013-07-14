<?php
	
	include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		
		if(isset($_POST['order'])){
			$order = $_POST['order'];
		
			$fh = fopen($pages_path.'order.json', 'w') or die("can't open file");
			fwrite( $fh, $order );
			@chmod( $fh, $perm_files );
			fclose($fh);
			
			echo json_encode(array(
				'success' => true
			));

		}
	}

?>