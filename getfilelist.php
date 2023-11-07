<?php
// Specify the directory to scan for files
$dir = './faktury';

// Get the filenames
$files = scandir($dir);

// Output the filenames in JSON format
echo json_encode($files);
return json_encode($files);
?>