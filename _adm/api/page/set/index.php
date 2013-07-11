<?php
	
	include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');
	
	if($gonext){
		
		if(file_exists($pages_path)){
			if(!is_dir($pages_path)){
				_remove($pages_path);
				mkdir( $pages_path , $perm_folder ) or die ( '{"error":"Can\'t create pages path."}' );
			}
		} else {
			mkdir( $pages_path , $perm_folder ) or die ( '{"error":"Can\'t create pages path."}' );
		}
		
		$model = '';
		$page = '';
		if(isset($_POST['model'])){
			$model = $_POST['model'];
		}
		if(isset($_POST['page'])){
			$page = $_POST['page'];
		}
		
		$fh = fopen($pages_path.'model.json', 'w') or die("can't open file");
		fwrite( $fh, $model );
		@chmod( $fh, $perm_files );
		fclose($fh);

		$fh = fopen($pages_path.'page.txt', 'w') or die("can't open file");
		fwrite( $fh, $page );
		@chmod( $fh, $perm_files );
		fclose($fh);
		
		include_once(dirname(dirname(__FILE__)).'/get/index.php');
		// echo dirname(dirname(__FILE__)).'/get/index.php';

	}

?>