<?PHP
	$data = json_decode($_POST['json'],true) ;
	$filename = $data['filename'] ;
	$out = json_encode($data['data']) ;
	file_put_contents($filename,$out, FILE_APPEND);
	$ok=file_get_contents($filename);
	$ok=str_replace("][",",",$ok);
	file_put_contents($filename,$ok);
?>
