<?php
/***
 * 
 * Takes as input two directory paths A and B
 * 
 * Copies all HTML files from A to B and fixes ID attributes:
 * 		- adds missing IDs to all elements
 * 		- overwrites duplicated IDs
 * 
 * Usage:
 * 		php fixIDs.php sources_dir/ output_dir/
 * 
 */
$inputDir = $argv[1];
$outputDir =  $argv[2];

if ( ! ( is_dir( $inputDir ) && $dh = opendir( $inputDir ) ) )	
	die("\nERROR - Input directory missing or incorrect \n\n");

if (!is_dir( $outputDir ))
	die("\nERROR - Output directory missing or incorrect \n\n");

echo "\n";

while ( ( $filename = readdir( $dh ) ) !== false ) {
	
	if ( (substr( $filename, -5 ) == '.html'))	
		{
		echo "Processing: ".$filename."\n";		
		
		$inputFilePath = $inputDir.$filename;
		$outputFilePath = $outputDir.$filename;
		
		$doc = new DOMDocument();
		$doc->loadHTMLFile($inputFilePath);
		
		$elements = $doc->getElementsByTagName('*');
		
		$existingIDs = array();
		
		foreach ($elements as $element) {
			$elementID = $element->getAttribute("id");
		
			if ( in_array($elementID, $existingIDs) || ($elementID == ''))
				{
				$nodePath = $element->getNodePath();
				
				// Note: change this line to change ID structure
				$newID = chr(97 + mt_rand(0, 25)).substr(md5($nodePath),0,14);

				echo "\tAdding ID ".$newID." to element: ".$nodePath."\n";
				
				$element->setAttribute("id", $newID);
				$elementID = $newID;
				}
				
			$existingIDs[] = $elementID;
			}
		
		$doc->saveHTMLFile($outputFilePath);
		}		
}

echo "\n";
?>